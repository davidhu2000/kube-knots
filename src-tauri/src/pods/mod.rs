use k8s_openapi::api::core::v1::Pod;

use kube::api::ObjectList;

use crate::internal::get_resource_list;

#[tauri::command]
pub async fn get_pods(namespace: Option<String>) -> ObjectList<Pod> {
    return get_resource_list(namespace).await;
}
