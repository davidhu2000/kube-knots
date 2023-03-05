use k8s_openapi::api::networking::v1::Ingress;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::{create_resource, delete_resource, get_resource_api, update_resource};

#[tauri::command]
pub async fn get_ingresses(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<Ingress>, String> {
    let api: Api<Ingress> = get_resource_api(context, namespace).await;
    let lp = ListParams::default();

    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
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
