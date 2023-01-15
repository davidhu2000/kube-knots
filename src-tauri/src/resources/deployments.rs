use k8s_openapi::api::apps::v1::Deployment;
use kube::{api::ListParams, core::ObjectList, Api};

use super::internal::get_api;

#[tauri::command]
pub async fn get_deployments(namespace: Option<String>) -> ObjectList<Deployment> {
    let api: Api<Deployment> = get_api(namespace).await;
    let lp = ListParams::default();
    return api.list(&lp).await.unwrap();
}
