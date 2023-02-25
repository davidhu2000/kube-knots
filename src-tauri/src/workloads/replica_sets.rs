use k8s_openapi::api::apps::v1::ReplicaSet;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::get_api;

#[tauri::command]
pub async fn get_replica_sets(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<ReplicaSet>, String> {
    let api: Api<ReplicaSet> = get_api(context, namespace).await;
    let lp = ListParams::default();
    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}
