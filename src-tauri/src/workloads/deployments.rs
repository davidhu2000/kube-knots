use k8s_openapi::api::apps::v1::Deployment;
use kube::{
    api::{ListParams, Patch, PatchParams},
    core::ObjectList,
    Api,
};

use crate::internal::{get_resource_api, update_resource};

#[tauri::command]
pub async fn get_deployments(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<Deployment>, String> {
    let api: Api<Deployment> = get_resource_api(context, namespace).await;
    let lp = ListParams::default();
    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}

#[tauri::command]
pub async fn update_deployment(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: Deployment,
) -> Result<Deployment, String> {
    return update_resource(context, namespace, name, resource).await;
}

#[tauri::command]
pub async fn restart_deployment(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    let api: Api<Deployment> = get_resource_api(context, namespace).await;
    let resource = api.restart(&name).await;

    return match resource {
        Ok(_resource) => Ok(true),
        Err(err) => {
            println!("Error restarting deployment: {}", err);
            return Err(err.to_string());
        }
    };
}

#[tauri::command]
pub async fn scale_deployment(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    replicas: u8,
) -> Result<bool, String> {
    let api: Api<Deployment> = get_resource_api(context, namespace).await;
    let spec = serde_json::json!({ "spec": { "replicas": replicas }});
    let pp = PatchParams::default();
    let patch = Patch::Merge(&spec);
    let resource = api.patch_scale(&name, &pp, &patch).await;

    return match resource {
        Ok(_resource) => Ok(true),
        Err(err) => {
            println!("Error scaling deployment: {}", err);
            return Err(err.to_string());
        }
    };
}
