use k8s_openapi::api::core::v1::Service;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::{create_resource, delete_resource, get_resource_api, update_resource};

#[tauri::command]
pub async fn get_services(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<Service>, String> {
    let api: Api<Service> = get_resource_api(context, namespace).await;
    let lp = ListParams::default();

    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
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
