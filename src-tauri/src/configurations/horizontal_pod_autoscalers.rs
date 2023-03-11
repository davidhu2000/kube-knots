use k8s_openapi::api::autoscaling::v1::HorizontalPodAutoscaler;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::{
    client::get_resource_api,
    resources::{create_resource, delete_resource, update_resource},
};

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
pub async fn create_horizontal_pod_autoscaler(
    context: Option<String>,
    resource: HorizontalPodAutoscaler,
) -> Result<HorizontalPodAutoscaler, String> {
    return create_resource(context, resource).await;
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

#[tauri::command]
pub async fn delete_horizontal_pod_autoscaler(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    return delete_resource::<HorizontalPodAutoscaler>(context, namespace, name).await;
}
