use k8s_openapi::api::batch::v1::CronJob;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::get_resource_api;

#[tauri::command]
pub async fn get_cron_jobs(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<CronJob>, String> {
    let api: Api<CronJob> = get_resource_api(context, namespace).await;
    let lp = ListParams::default();
    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}
