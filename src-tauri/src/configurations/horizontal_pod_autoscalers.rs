use k8s_openapi::api::autoscaling::v1::HorizontalPodAutoscaler;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::{get_resource_api, update_resource};

#[tauri::command]
pub async fn get_horizontal_pod_autoscalers(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<HorizontalPodAutoscaler>, String> {
    let api: Api<HorizontalPodAutoscaler> = get_resource_api(context, namespace).await;
    let lp = ListParams::default();
    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}

#[tauri::command]
pub async fn update_horizontal_pod_autoscaler(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: HorizontalPodAutoscaler,
) -> Result<HorizontalPodAutoscaler, String> {
    return update_resource(context, namespace, name, resource).await;
}