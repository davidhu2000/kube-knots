use k8s_openapi::api::apps::v1::ReplicaSet;
use kube::{api::ListParams, core::ObjectList, Api};

use super::internal::get_api;

#[tauri::command]
pub async fn get_replica_sets(namespace: Option<String>) -> ObjectList<ReplicaSet> {
    let api: Api<ReplicaSet> = get_api(namespace).await;
    let lp = ListParams::default();
    return api.list(&lp).await.unwrap();
}
