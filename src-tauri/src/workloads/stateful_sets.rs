use k8s_openapi::api::apps::v1::StatefulSet;
use kube::{
    api::{ListParams, Patch, PatchParams},
    core::ObjectList,
    Api,
};

use crate::internal::{create_resource, delete_resource, get_resource_api, update_resource};

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
    let api: Api<StatefulSet> = get_resource_api(context, namespace).await;
    let spec = serde_json::json!({ "spec": { "replicas": replicas }});
    let pp = PatchParams::default();
    let patch = Patch::Merge(&spec);
    let resource = api.patch_scale(&name, &pp, &patch).await;

    return match resource {
        Ok(_resource) => Ok(true),
        Err(err) => {
            println!("Error scaling stateful set: {}", err);
            return Err(err.to_string());
        }
    };
}
