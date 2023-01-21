use k8s_openapi::NamespaceResourceScope;
use kube::{Api, Client};

pub async fn get_api<T>(namespace: Option<String>) -> Api<T>
where
    T: serde::de::DeserializeOwned
        + std::fmt::Debug
        + Clone
        + k8s_openapi::Metadata
        + kube::Resource<Scope = NamespaceResourceScope>,
    <T as kube::Resource>::DynamicType: std::default::Default,
{
    let client = Client::try_default().await.unwrap();
    let api: Api<T> = match namespace {
        Some(ns) => Api::namespaced(client, &ns),
        None => Api::all(client),
    };
    return api;
}
