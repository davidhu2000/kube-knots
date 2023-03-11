use k8s_openapi::api::core::v1::Event;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::client::get_resource_api;

#[tauri::command]
pub async fn get_events(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<Event>, String> {
    let api: Api<Event> = get_resource_api(context, namespace).await;

    let lp = ListParams::default();

    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}
