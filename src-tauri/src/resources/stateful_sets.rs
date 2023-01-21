use k8s_openapi::api::apps::v1::StatefulSet;
use kube::{api::ListParams, core::ObjectList, Api};

use super::internal::get_api;

#[tauri::command]
pub async fn get_stateful_sets(namespace: Option<String>) -> ObjectList<StatefulSet> {
    let api: Api<StatefulSet> = get_api(namespace).await;
    let lp = ListParams::default();
    return api.list(&lp).await.unwrap();
}
