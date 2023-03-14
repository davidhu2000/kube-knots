use k8s_openapi::api::core::v1::ConfigMap;
use kube::core::ObjectList;

use crate::internal::resources::{
    create_resource, delete_resource, get_resources, update_resource,
};

#[tauri::command]
pub async fn get_config_maps(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<ConfigMap>, String> {
    return get_resources::<ConfigMap>(context, namespace).await;
}

#[tauri::command]
pub async fn create_config_map(
    context: Option<String>,
    resource: ConfigMap,
) -> Result<ConfigMap, String> {
    return create_resource(context, resource).await;
}

#[tauri::command]
pub async fn update_config_map(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: ConfigMap,
) -> Result<ConfigMap, String> {
    return update_resource(context, namespace, name, resource).await;
}

#[tauri::command]
pub async fn delete_config_map(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    return delete_resource::<ConfigMap>(context, namespace, name).await;
}
