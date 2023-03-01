use k8s_openapi::api::core::v1::Pod;

use kube::{
    api::{DeleteParams, ListParams, LogParams},
    core::ObjectList,
    Api,
};

use crate::internal::get_resource_api;

#[tauri::command]
pub async fn get_pods(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<Pod>, String> {
    let api: Api<Pod> = get_resource_api(context, namespace).await;
    let lp = ListParams::default();
    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}

#[tauri::command]
pub async fn get_pod_logs(
    context: Option<String>,
    namespace: Option<String>,
    pod_name: String,
    container: Option<String>,
) -> Result<String, String> {
    let pods: Api<Pod> = get_resource_api(context, namespace).await;

    let mut lp = LogParams::default();
    lp.container = container;
    let result = pods.logs(&pod_name, &lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}

#[tauri::command]
pub async fn delete_pod(
    context: Option<String>,
    namespace: Option<String>,
    pod_name: String,
) -> Result<bool, String> {
    let api: Api<Pod> = get_resource_api(context, namespace).await;

    let dp = DeleteParams::default();
    let result = api.delete(&pod_name, &dp).await;

    return match result {
        Ok(_) => Ok(true),
        Err(e) => Err(e.to_string()),
    };
}
