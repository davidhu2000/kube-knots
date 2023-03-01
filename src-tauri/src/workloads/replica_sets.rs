use k8s_openapi::api::apps::v1::ReplicaSet;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::{get_resource_api, update_resource};

#[tauri::command]
pub async fn get_replica_sets(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<ReplicaSet>, String> {
    let api: Api<ReplicaSet> = get_resource_api(context, namespace).await;
    let lp = ListParams::default();
    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}

#[tauri::command]
pub async fn update_replica_set(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: ReplicaSet,
) -> Result<ReplicaSet, String> {
    return update_resource(context, namespace, name, resource).await;
}
