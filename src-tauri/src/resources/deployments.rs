use k8s_openapi::api::apps::v1::Deployment;
use kube::core::ObjectList;

use super::internal::get_resource_list;

#[tauri::command]
pub async fn get_deployments(namespace: Option<String>) -> ObjectList<Deployment> {
    return get_resource_list(namespace).await;
}
