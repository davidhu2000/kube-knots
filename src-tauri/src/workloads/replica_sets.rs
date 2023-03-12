use k8s_openapi::api::apps::v1::ReplicaSet;
use kube::core::ObjectList;

use crate::internal::resources::{
    create_resource, delete_resource, get_resources, restart_resource, scale_resource,
    update_resource,
};
#[tauri::command]
pub async fn get_replica_sets(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<ReplicaSet>, String> {
    return get_resources::<ReplicaSet>(context, namespace).await;
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
pub async fn restart_replica_set(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    return restart_resource::<ReplicaSet>(context, namespace, name).await;
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
