use k8s_openapi::api::{batch::v1::Job, core::v1::Pod};
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::{
    client::get_resource_api,
    resources::{create_resource, delete_resource, get_resources, update_resource},
};

use super::pods::get_pod_logs;

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

#[tauri::command]
pub async fn get_job_logs(
    context: Option<String>,
    namespace: Option<String>,
    controller_id: String,
) -> Result<String, String> {
    let api: Api<Pod> = get_resource_api(context.clone(), namespace.clone()).await?;
    let mut lp = ListParams::default();
    lp.label_selector = Some(format!("controller-uid={}", controller_id));

    let result = api.list(&lp).await.unwrap();

    let pod = result.items.get(0);

    if pod.is_none() {
        return Ok("No pod found for job".to_string());
    }

    let pod = pod.unwrap();

    let pod_name = pod.metadata.name.clone().unwrap();

    return get_pod_logs(context, namespace, pod_name, None).await;
}
