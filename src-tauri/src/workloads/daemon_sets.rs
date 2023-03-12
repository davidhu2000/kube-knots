use k8s_openapi::api::apps::v1::DaemonSet;
use kube::{core::ObjectList, Api};

use crate::internal::{
    client::get_resource_api,
    resources::{create_resource, delete_resource, get_resources, update_resource},
};

#[tauri::command]
pub async fn get_daemon_sets(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<DaemonSet>, String> {
    return get_resources::<DaemonSet>(context, namespace).await;
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
