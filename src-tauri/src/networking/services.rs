use k8s_openapi::api::core::v1::Service;
use kube::core::ObjectList;

use crate::internal::resources::{
    create_resource, delete_resource, get_resources, update_resource,
};

#[tauri::command]
pub async fn get_services(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<Service>, String> {
    return get_resources::<Service>(context, namespace).await;
}

#[tauri::command]
pub async fn create_service(context: Option<String>, resource: Service) -> Result<Service, String> {
    return create_resource(context, resource).await;
}

#[tauri::command]
pub async fn update_service(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: Service,
) -> Result<Service, String> {
    return update_resource(context, namespace, name, resource).await;
}

#[tauri::command]
pub async fn delete_service(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    return delete_resource::<Service>(context, namespace, name).await;
}
