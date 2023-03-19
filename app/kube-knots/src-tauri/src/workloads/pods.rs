use k8s_openapi::api::core::v1::Pod;

use kube::{
    api::{EvictParams, LogParams},
    core::ObjectList,
    Api,
};
use log::error;

use crate::internal::{
    client::get_resource_api,
    resources::{create_resource, delete_resource, get_resources, update_resource},
};

#[tauri::command]
pub async fn get_pods(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<Pod>, String> {
    return get_resources::<Pod>(context, namespace).await;
}

#[tauri::command]
pub async fn get_pod_logs(
    context: Option<String>,
    namespace: Option<String>,
    pod_name: String,
    container: Option<String>,
) -> Result<String, String> {
    let pods: Api<Pod> = get_resource_api(context, namespace).await?;

    let mut lp = LogParams::default();
    lp.container = container;
    let result = pods.logs(&pod_name, &lp).await;

    return match result {
        Ok(resource) => Ok(resource),
        Err(e) => {
            error!("get_pod_logs: {}", e);
            return Err(e.to_string());
        }
    };
}

#[tauri::command]
pub async fn create_pod(context: Option<String>, resource: Pod) -> Result<Pod, String> {
    return create_resource(context, resource).await;
}

#[tauri::command]
pub async fn update_pod(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: Pod,
) -> Result<Pod, String> {
    return update_resource(context, namespace, name, resource).await;
}

#[tauri::command]
pub async fn delete_pod(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    return delete_resource::<Pod>(context, namespace, name).await;
}

#[tauri::command]
pub async fn evict_pod(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    let pods: Api<Pod> = get_resource_api(context, namespace).await?;

    let result = pods.evict(&name, &EvictParams::default()).await;

    return match result {
        Ok(_) => Ok(true),
        Err(e) => {
            error!("evict_pod: {}", e);
            return Err(e.to_string());
        }
    };
}
