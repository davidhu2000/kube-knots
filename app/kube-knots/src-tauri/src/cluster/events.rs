use k8s_openapi::api::core::v1::Event;
use kube::core::ObjectList;

use crate::internal::resources::get_resources;

#[tauri::command]
pub async fn get_events(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<Event>, String> {
    return get_resources::<Event>(context, namespace).await;
}
