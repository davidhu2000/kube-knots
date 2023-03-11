use k8s_openapi::api::core::v1::Secret;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::{
    client::get_resource_api,
    resources::{create_resource, delete_resource, update_resource},
};

#[tauri::command]
pub async fn get_secrets(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<Secret>, String> {
    let api: Api<Secret> = get_resource_api(context, namespace).await;
    let lp = ListParams::default();
    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
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
