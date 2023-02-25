use k8s_openapi::api::core::v1::Service;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::get_api;

#[tauri::command]
pub async fn get_services(namespace: Option<String>) -> Result<ObjectList<Service>, String> {
    let api: Api<Service> = get_api(namespace).await;
    let lp = ListParams::default();

    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}
