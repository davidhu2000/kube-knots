use k8s_openapi::api::policy::v1::PodDisruptionBudget;
use kube::core::ObjectList;

use crate::internal::resources::{
    create_resource, delete_resource, get_resources, update_resource,
};

#[tauri::command]
pub async fn get_pod_disruption_budgets(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<PodDisruptionBudget>, String> {
    return get_resources::<PodDisruptionBudget>(context, namespace).await;
}

#[tauri::command]
pub async fn create_pod_disruption_budget(
    context: Option<String>,
    resource: PodDisruptionBudget,
) -> Result<PodDisruptionBudget, String> {
    return create_resource(context, resource).await;
}

#[tauri::command]
pub async fn update_pod_disruption_budget(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: PodDisruptionBudget,
) -> Result<PodDisruptionBudget, String> {
    return update_resource(context, namespace, name, resource).await;
}

#[tauri::command]
pub async fn delete_pod_disruption_budget(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    return delete_resource::<PodDisruptionBudget>(context, namespace, name).await;
}
