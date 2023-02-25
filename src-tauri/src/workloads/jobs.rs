use k8s_openapi::api::batch::v1::Job;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::get_api;

#[tauri::command]
pub async fn get_jobs(namespace: Option<String>) -> Result<ObjectList<Job>, String> {
    let api: Api<Job> = get_api(namespace).await;

    let lp = ListParams::default();

    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}

#[tauri::command]
pub async fn create_job(namespace: Option<String>, job: Job) -> Result<Job, String> {
    let api: Api<Job> = get_api(namespace).await;

    let result = api.create(&Default::default(), &job).await;

    return match result {
        Ok(item) => Ok(item),
        Err(e) => Err(e.to_string()),
    };
}
