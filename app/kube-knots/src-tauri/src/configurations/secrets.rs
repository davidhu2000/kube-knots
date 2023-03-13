use k8s_openapi::api::core::v1::Secret;
use kube::core::ObjectList;

use crate::internal::resources::{
    create_resource, delete_resource, get_resources, update_resource,
};

#[tauri::command]
pub async fn get_secrets(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<Secret>, String> {
    return get_resources::<Secret>(context, namespace).await;
}

#[tauri::command]
pub async fn create_secret(context: Option<String>, resource: Secret) -> Result<Secret, String> {
    return create_resource(context, resource).await;
}

#[tauri::command]
pub async fn update_secret(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: Secret,
) -> Result<Secret, String> {
    return update_resource(context, namespace, name, resource).await;
}

#[tauri::command]
pub async fn delete_secret(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    return delete_resource::<Secret>(context, namespace, name).await;
}
