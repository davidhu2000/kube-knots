use k8s_openapi::api::apps::v1::Deployment;
use kube::{
    api::{ListParams, Patch, PatchParams},
    core::ObjectList,
    Api,
};

use crate::internal::get_api;

#[tauri::command]
pub async fn get_deployments(namespace: Option<String>) -> ObjectList<Deployment> {
    let api: Api<Deployment> = get_api(namespace).await;
    let lp = ListParams::default();
    return api.list(&lp).await.unwrap();
}

#[tauri::command]
pub async fn restart_deployment(namespace: Option<String>, name: String) -> bool {
    let api: Api<Deployment> = get_api(namespace).await;
    println!("{}", name);
    let resource = api.restart(&name).await;

    let result = match resource {
        Ok(_resource) => true,
        Err(err) => {
            println!("Error restarting deployment: {}", err);
            return false;
        }
    };
    return result;
}

#[tauri::command]
pub async fn scale_deployment(namespace: Option<String>, name: String, replicas: u8) -> bool {
    let api: Api<Deployment> = get_api(namespace).await;
    let spec = serde_json::json!({ "spec": { "replicas": replicas }});
    let pp = PatchParams::default();
    let patch = Patch::Merge(&spec);
    let resource = api.patch_scale(&name, &pp, &patch).await;

    let result = match resource {
        Ok(_resource) => true,
        Err(err) => {
            println!("Error scaling deployment: {}", err);
            return false;
        }
    };

    return result;
}
