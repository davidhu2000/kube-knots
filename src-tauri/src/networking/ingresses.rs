use k8s_openapi::api::networking::v1::Ingress;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::get_api;

#[tauri::command]
pub async fn get_ingresses(namespace: Option<String>) -> ObjectList<Ingress> {
    let api: Api<Ingress> = get_api(namespace).await;
    let lp = ListParams::default();
    return api.list(&lp).await.unwrap();
}
