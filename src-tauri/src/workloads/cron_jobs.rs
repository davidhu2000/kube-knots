use k8s_openapi::api::batch::v1::CronJob;
use kube::core::ObjectList;

use crate::internal::resources::{
    create_resource, delete_resource, get_resources, update_resource,
};

#[tauri::command]
pub async fn get_cron_jobs(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<CronJob>, String> {
    return get_resources::<CronJob>(context, namespace).await;
}

#[tauri::command]
pub async fn create_cron_job(
    context: Option<String>,
    resource: CronJob,
) -> Result<CronJob, String> {
    return create_resource(context, resource).await;
}

#[tauri::command]
pub async fn update_cron_job(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: CronJob,
) -> Result<CronJob, String> {
    return update_resource(context, namespace, name, resource).await;
}

#[tauri::command]
pub async fn delete_cron_job(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    return delete_resource::<CronJob>(context, namespace, name).await;
}
