use k8s_openapi::api::batch::v1::CronJob;

use kube::{
    api::{Api, ListParams, ObjectList},
    Client,
};

#[tauri::command]
pub async fn get_cron_jobs(namespace: Option<String>) -> ObjectList<CronJob> {
    let client = Client::try_default().await.unwrap();

    // match namespace
    let cron_jobs: Api<CronJob> = match namespace {
        Some(ns) => Api::namespaced(client, &ns),
        None => Api::all(client),
    };

    let lp = ListParams::default();
    return cron_jobs.list(&lp).await.unwrap();
}
