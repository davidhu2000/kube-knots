use k8s_openapi::NamespaceResourceScope;
use kube::{
    config::{KubeConfigOptions, Kubeconfig},
    Api, Client, Config,
};

pub async fn get_api<T>(context: Option<String>, namespace: Option<String>) -> Api<T>
where
    T: serde::de::DeserializeOwned
        + std::fmt::Debug
        + Clone
        + k8s_openapi::Metadata
        + kube::Resource<Scope = NamespaceResourceScope>,
    <T as kube::Resource>::DynamicType: std::default::Default,
{
    let kubeconfig = Kubeconfig::read().unwrap();

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

            let config = Config::from_custom_kubeconfig(kubeconfig, &options)
                .await
                .unwrap();

            Client::try_from(config).unwrap()
        }
        None => Client::try_default().await.unwrap(),
    };

    let api: Api<T> = match namespace {
        Some(ns) => Api::<T>::namespaced(client, &ns),
        None => Api::<T>::all(client),
    };
    return api;
}
