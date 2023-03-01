use k8s_openapi::api::core::v1::Secret;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::get_resource_api;

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
