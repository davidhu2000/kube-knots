use k8s_openapi::api::apps::v1::StatefulSet;
use kube::{
    api::{ListParams, Patch, PatchParams},
    core::ObjectList,
    Api,
};

use crate::internal::get_api;

#[tauri::command]
pub async fn get_stateful_sets(
    namespace: Option<String>,
) -> Result<ObjectList<StatefulSet>, String> {
    let api: Api<StatefulSet> = get_api(namespace).await;
    let lp = ListParams::default();
    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}

#[tauri::command]
pub async fn restart_stateful_set(namespace: Option<String>, name: String) -> Result<bool, String> {
    let api: Api<StatefulSet> = get_api(namespace).await;
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
    namespace: Option<String>,
    name: String,
    replicas: u8,
) -> Result<bool, String> {
    let api: Api<StatefulSet> = get_api(namespace).await;
    let spec = serde_json::json!({ "spec": { "replicas": replicas }});
    let pp = PatchParams::default();
    let patch = Patch::Merge(&spec);
    let resource = api.patch_scale(&name, &pp, &patch).await;

    return match resource {
        Ok(_resource) => Ok(true),
        Err(err) => {
            println!("Error scaling deployment: {}", err);
            return Err(err.to_string());
        }
    };
}
