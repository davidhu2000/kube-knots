use k8s_openapi::NamespaceResourceScope;
use kube::{
    api::{DeleteParams, ListParams, Patch, PatchParams},
    core::{util::Restart, ObjectList},
    Api,
};
use serde::Serialize;

use super::client::get_resource_api;

pub async fn get_resources<T>(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<T>, String>
where
    T: serde::de::DeserializeOwned
        + std::fmt::Debug
        + Clone
        + k8s_openapi::Metadata
        + kube::Resource<Scope = NamespaceResourceScope>
        + Serialize,
    <T as kube::Resource>::DynamicType: std::default::Default,
{
    let api: Api<T> = get_resource_api(context, namespace).await?;
    let lp = ListParams::default();
    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}

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

    let api: Api<T> = get_resource_api(context, Some(namespace.to_string())).await?;

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
    let api: Api<T> = get_resource_api(context, namespace).await?;

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
    let api: Api<T> = get_resource_api(context, namespace).await?;

    let dp = DeleteParams::default();
    let result = api.delete(&name, &dp).await;

    return match result {
        Ok(_) => Ok(true),
        Err(e) => Err(e.to_string()),
    };
}

pub async fn restart_resource<T>(
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
        + serde::Serialize
        + Restart,
    <T as kube::Resource>::DynamicType: std::default::Default,
{
    let api: Api<T> = get_resource_api(context, namespace).await?;
    let resource = api.restart(&name).await;

    return match resource {
        Ok(_resource) => Ok(true),
        Err(err) => {
            println!("Error restarting resource {}: {}", name, err);
            return Err(err.to_string());
        }
    };
}
pub async fn scale_resource<T>(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    replicas: u8,
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
    let api: Api<T> = get_resource_api(context, namespace).await?;
    let spec = serde_json::json!({ "spec": { "replicas": replicas }});
    let pp = PatchParams::default();
    let patch = Patch::Merge(&spec);
    let resource = api.patch_scale(&name, &pp, &patch).await;

    return match resource {
        Ok(_resource) => Ok(true),
        Err(err) => Err(err.to_string()),
    };
}
