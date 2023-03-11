use k8s_openapi::NamespaceResourceScope;
use kube::{
    api::{DeleteParams, Patch, PatchParams},
    Api,
};
use serde::Serialize;

use super::client::get_resource_api;

pub async fn create_resource<T>(context: Option<String>, resource: T) -> Result<T, String>
where
    T: serde::de::DeserializeOwned
        + std::fmt::Debug
        + Clone
        + k8s_openapi::Metadata
        + kube::Resource<Scope = NamespaceResourceScope>
        + Serialize,
    <T as kube::Resource>::DynamicType: std::default::Default,
{
    let namespace = match resource.meta().namespace {
        Some(ref ns) => ns,
        None => {
            // TODO: fix this code to pull the default namespace from the current context
            // println!("No namespace found in resource, using default");
            // let config = get_config().unwrap();
            // let current_context = config.current_context.unwrap();

            // let context_to_use = match context {
            //     Some(ref c) => c,
            //     None => &current_context,
            // };

            // let context = config
            //     .contexts
            //     .iter()
            //     .find(|&c| &c.name == context_to_use)
            //     .unwrap();

            // let context_config = context.context.unwrap();
            // let namespace = context_config.namespace.unwrap_or("default".to_string());

            // &namespace
            "default"
        }
    };

    let api: Api<T> = get_resource_api(context, Some(namespace.to_string())).await;

    let result = api.create(&Default::default(), &resource).await;

    return match result {
        Ok(resource) => Ok(resource),
        Err(e) => Err(e.to_string()),
    };
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
