use k8s_openapi::api::batch::v1::Job;
use kube::core::ObjectList;

use crate::internal::resources::{
    create_resource, delete_resource, get_resources, update_resource,
};

#[tauri::command]
pub async fn get_jobs(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<Job>, String> {
    return get_resources::<Job>(context, namespace).await;
}

#[tauri::command]
pub async fn create_job(context: Option<String>, job: Job) -> Result<Job, String> {
    return create_resource(context, job).await;
}

#[tauri::command]
pub async fn update_job(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: Job,
) -> Result<Job, String> {
    return update_resource(context, namespace, name, resource).await;
}

#[tauri::command]
pub async fn delete_job(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    return delete_resource::<Job>(context, namespace, name).await;
}
