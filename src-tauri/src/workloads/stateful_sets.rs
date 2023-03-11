use k8s_openapi::api::apps::v1::StatefulSet;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::{
    client::get_resource_api,
    resources::{create_resource, delete_resource, scale_resource, update_resource},
};

#[tauri::command]
pub async fn get_stateful_sets(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<StatefulSet>, String> {
    let api: Api<StatefulSet> = get_resource_api(context, namespace).await;
    let lp = ListParams::default();
    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}

#[tauri::command]
pub async fn create_stateful_set(
    context: Option<String>,
    resource: StatefulSet,
) -> Result<StatefulSet, String> {
    return create_resource(context, resource).await;
}

#[tauri::command]
pub async fn update_stateful_set(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: StatefulSet,
) -> Result<StatefulSet, String> {
    return update_resource(context, namespace, name, resource).await;
}

#[tauri::command]
pub async fn delete_stateful_set(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    return delete_resource::<StatefulSet>(context, namespace, name).await;
}

#[tauri::command]
pub async fn restart_stateful_set(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    let api: Api<StatefulSet> = get_resource_api(context, namespace).await;
    let resource = api.restart(&name).await;

    return match resource {
        Ok(_resource) => Ok(true),
        Err(err) => {
            println!("Error restarting stateful set: {}", err);
            return Err(err.to_string());
        }
    };
}

#[tauri::command]
pub async fn scale_stateful_set(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    replicas: u8,
) -> Result<bool, String> {
    return scale_resource::<StatefulSet>(context, namespace, name, replicas).await;
}
