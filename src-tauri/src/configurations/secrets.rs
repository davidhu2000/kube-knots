use k8s_openapi::api::core::v1::Secret;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::{get_resource_api, update_resource};

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
pub async fn update_secret(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: Secret,
) -> Result<Secret, String> {
    return update_resource(context, namespace, name, resource).await;
}
