use k8s_openapi::api::batch::v1::CronJob;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::{delete_resource, get_resource_api, update_resource};

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

#[tauri::command]
pub async fn create_cron_job(
    context: Option<String>,
    resource: CronJob,
) -> Result<CronJob, String> {
    let namespace = match resource.metadata.namespace {
        Some(ref ns) => ns,
        None => {
            // TODO: fix this code to pull the default namespace from the current context
            // println!("No namespace found in resource, using default");
            // let config = get_config().unwrap();
            // let current_context = config.current_context.unwrap();

            // let context_to_use = match context {
            //     Some(ref c) => c,
            //     None => &current_context,
            // };

            // let context = config
            //     .contexts
            //     .iter()
            //     .find(|&c| &c.name == context_to_use)
            //     .unwrap();

            // let context_config = context.context.unwrap();
            // let namespace = context_config.namespace.unwrap_or("default".to_string());

            // &namespace
            "default"
        }
    };

    let api: Api<CronJob> = get_resource_api(context, Some(namespace.to_string())).await;

    let result = api.create(&Default::default(), &resource).await;

    return match result {
        Ok(resource) => Ok(resource),
        Err(e) => Err(e.to_string()),
    };
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
