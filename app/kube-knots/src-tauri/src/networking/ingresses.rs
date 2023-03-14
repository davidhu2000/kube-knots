use k8s_openapi::api::networking::v1::Ingress;
use kube::core::ObjectList;

use crate::internal::resources::{
    create_resource, delete_resource, get_resources, update_resource,
};

#[tauri::command]
pub async fn get_ingresses(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<Ingress>, String> {
    return get_resources::<Ingress>(context, namespace).await;
}

#[tauri::command]
pub async fn create_ingress(context: Option<String>, resource: Ingress) -> Result<Ingress, String> {
    return create_resource(context, resource).await;
}

#[tauri::command]
pub async fn update_ingress(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: Ingress,
) -> Result<Ingress, String> {
    return update_resource(context, namespace, name, resource).await;
}

#[tauri::command]
pub async fn delete_ingress(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    return delete_resource::<Ingress>(context, namespace, name).await;
}
