use k8s_openapi::api::batch::v1::Job;
use kube::{api::ListParams, core::ObjectList, Api};

use super::internal::get_api;

#[tauri::command]
pub async fn get_jobs(namespace: Option<String>) -> ObjectList<Job> {
    let api: Api<Job> = get_api(namespace).await;

    let lp = ListParams::default();

    return api.list(&lp).await.unwrap();
}
