use k8s_openapi::api::apps::v1::DaemonSet;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::{create_resource, delete_resource, get_resource_api, update_resource};

#[tauri::command]
pub async fn get_daemon_sets(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<DaemonSet>, String> {
    let api: Api<DaemonSet> = get_resource_api(context, namespace).await;
    let lp = ListParams::default();
    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}

#[tauri::command]
pub async fn create_daemon_set(
    context: Option<String>,
    resource: DaemonSet,
) -> Result<DaemonSet, String> {
    return create_resource(context, resource).await;
}

#[tauri::command]
pub async fn update_daemon_set(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: DaemonSet,
) -> Result<DaemonSet, String> {
    return update_resource(context, namespace, name, resource).await;
}

#[tauri::command]
pub async fn delete_daemon_set(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    return delete_resource::<DaemonSet>(context, namespace, name).await;
}

#[tauri::command]
pub async fn restart_daemon_set(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    let api: Api<DaemonSet> = get_resource_api(context, namespace).await;
    let resource = api.restart(&name).await;

    return match resource {
        Ok(_resource) => Ok(true),
        Err(err) => {
            println!("Error restarting daemon set: {}", err);
            return Err(err.to_string());
        }
    };
}
