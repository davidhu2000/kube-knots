use k8s_openapi::api::core::v1::Service;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::get_api;

#[tauri::command]
pub async fn get_services(namespace: Option<String>) -> ObjectList<Service> {
    let api: Api<Service> = get_api(namespace).await;
    let lp = ListParams::default();
    return api.list(&lp).await.unwrap();
}
