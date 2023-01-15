use k8s_openapi::api::batch::v1::CronJob;
use kube::{api::ListParams, core::ObjectList, Api};

use super::internal::get_api;

#[tauri::command]
pub async fn get_cron_jobs(namespace: Option<String>) -> ObjectList<CronJob> {
    let api: Api<CronJob> = get_api(namespace).await;
    let lp = ListParams::default();
    return api.list(&lp).await.unwrap();
}
