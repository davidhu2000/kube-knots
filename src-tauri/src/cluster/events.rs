use k8s_openapi::api::core::v1::Event;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::get_api;

#[tauri::command]
pub async fn get_events(namespace: Option<String>) -> ObjectList<Event> {
    let api: Api<Event> = get_api(namespace).await;

    let lp = ListParams::default();

    return api.list(&lp).await.unwrap();
}
