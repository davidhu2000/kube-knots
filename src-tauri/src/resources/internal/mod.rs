use k8s_openapi::NamespaceResourceScope;
use kube::{api::ListParams, core::ObjectList, Api, Client};

pub async fn get_resource_list<T>(namespace: Option<String>) -> ObjectList<T>
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
    let lp = ListParams::default();
    return api.list(&lp).await.unwrap();
}
