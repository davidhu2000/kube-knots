use k8s_openapi::NamespaceResourceScope;
use kube::{
    api::{DeleteParams, Patch, PatchParams},
    config::{KubeConfigOptions, Kubeconfig},
    Api, Client, Config,
};
use serde::Serialize;

pub async fn get_resource_api<T>(context: Option<String>, namespace: Option<String>) -> Api<T>
where
    T: serde::de::DeserializeOwned
        + std::fmt::Debug
        + Clone
        + k8s_openapi::Metadata
        + kube::Resource<Scope = NamespaceResourceScope>,
    <T as kube::Resource>::DynamicType: std::default::Default,
{
    let client = get_client_with_context(context).await;

    let api: Api<T> = match namespace {
        Some(ns) => Api::<T>::namespaced(client, &ns),
        None => Api::<T>::all(client),
    };
    return api;
}

pub async fn get_client_with_context(context: Option<String>) -> Client {
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

    return client;
}

pub async fn update_resource<T>(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: T,
) -> Result<T, String>
where
    T: serde::de::DeserializeOwned
        + std::fmt::Debug
        + Clone
        + k8s_openapi::Metadata
        + kube::Resource<Scope = NamespaceResourceScope>
        + Serialize,
    <T as kube::Resource>::DynamicType: std::default::Default,
{
    let api: Api<T> = get_resource_api(context, namespace).await;

    let pp = PatchParams::default();
    let result = api.patch(&name, &pp, &Patch::Merge(&resource)).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}

pub async fn delete_resource<T>(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String>
where
    T: serde::de::DeserializeOwned
        + std::fmt::Debug
        + Clone
        + k8s_openapi::Metadata
        + kube::Resource<Scope = NamespaceResourceScope>
        + Serialize,
    <T as kube::Resource>::DynamicType: std::default::Default,
{
    let api: Api<T> = get_resource_api(context, namespace).await;

    let dp = DeleteParams::default();
    let result = api.delete(&name, &dp).await;

    return match result {
        Ok(_) => Ok(true),
        Err(e) => Err(e.to_string()),
    };
}
