use k8s_openapi::api::batch::v1::CronJob;
use kube::core::ObjectList;

use super::internal::get_resource_list;

#[tauri::command]
pub async fn get_cron_jobs(namespace: Option<String>) -> ObjectList<CronJob> {
    return get_resource_list(namespace).await;
}
