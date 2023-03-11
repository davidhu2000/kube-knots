use k8s_openapi::api::apps::v1::ReplicaSet;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::{
    client::get_resource_api,
    resources::{create_resource, delete_resource, scale_resource, update_resource},
};

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
pub async fn create_replica_set(
    context: Option<String>,
    resource: ReplicaSet,
) -> Result<ReplicaSet, String> {
    return create_resource(context, resource).await;
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

#[tauri::command]
pub async fn delete_replica_set(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    return delete_resource::<ReplicaSet>(context, namespace, name).await;
}

#[tauri::command]
pub async fn scale_replica_set(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    replicas: u8,
) -> Result<bool, String> {
    return scale_resource::<ReplicaSet>(context, namespace, name, replicas).await;
}
