use k8s_openapi::api::core::v1::Pod;

use kube::{
    api::{ListParams, LogParams},
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
    container_name: Option<String>,
) -> Result<String, String> {
    let pods: Api<Pod> = get_resource_api(context, namespace).await;

    let mut lp = LogParams::default();
    lp.container = container_name;
    let result = pods.logs(&pod_name, &lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}
