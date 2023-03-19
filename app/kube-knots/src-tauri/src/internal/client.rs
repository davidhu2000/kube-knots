use k8s_openapi::NamespaceResourceScope;
use kube::{
    config::{KubeConfigOptions, Kubeconfig},
    Api, Client, Config,
};
use log::error;

pub async fn get_resource_api<T>(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<Api<T>, String>
where
    T: serde::de::DeserializeOwned
        + std::fmt::Debug
        + Clone
        + k8s_openapi::Metadata
        + kube::Resource<Scope = NamespaceResourceScope>,
    <T as kube::Resource>::DynamicType: std::default::Default,
{
    let client = get_client_with_context(context).await?;

    let api: Api<T> = match namespace {
        Some(ns) => Api::<T>::namespaced(client, &ns),
        None => Api::<T>::all(client),
    };

    return Ok(api);
}

pub async fn get_client_with_context(context: Option<String>) -> Result<Client, String> {
    let kubeconfig = Kubeconfig::read();

    let kubeconfig = match kubeconfig {
        Ok(k) => k,
        Err(e) => {
            error!("get_client_with_context: Error reading kubeconfig: {}", e);
            return Err(e.to_string());
        }
    };

    let client = match context {
        Some(c) => {
            // let possible_context = kubeconfig.contexts.iter().find(|c| c.name == c);

            // if possible_context.is_none() {
            //     return Client::try_default().await.unwrap();
            // }

            let options = KubeConfigOptions {
                context: Some(c.clone()),
                cluster: None,
                user: None,
            };

            let config = Config::from_custom_kubeconfig(kubeconfig, &options).await;

            match config {
                Ok(c) => Client::try_from(c),
                Err(e) => {
                    error!(
                        "get_client_with_context: Error creating client from kubeconfig: {}",
                        e
                    );
                    return Err(e.to_string());
                }
            }
        }
        None => Client::try_default().await,
    };

    return match client {
        Ok(c) => Ok(c),
        Err(e) => {
            error!("get_client_with_context: Error creating client: {}", e);
            return Err(e.to_string());
        }
    };
}
