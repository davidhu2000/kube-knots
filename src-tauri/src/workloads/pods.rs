use k8s_openapi::api::core::v1::Pod;

use kube::{
    api::{ListParams, LogParams},
    core::ObjectList,
    Api,
};

use super::internal::get_api;

#[tauri::command]
pub async fn get_pods(namespace: Option<String>) -> ObjectList<Pod> {
    let api: Api<Pod> = get_api(namespace).await;
    let lp = ListParams::default();
    return api.list(&lp).await.unwrap();
}

#[tauri::command]
pub async fn get_pod_logs(
    namespace: Option<String>,
    pod_name: String,
    container_name: Option<String>,
) -> String {
    let pods: Api<Pod> = get_api(namespace).await;

    let mut lp = LogParams::default();
    lp.container = container_name;
    let log_string = pods.logs(&pod_name, &lp).await.unwrap();

    return log_string;
}
