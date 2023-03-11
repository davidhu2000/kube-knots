use k8s_openapi::api::core::v1::ReplicationController;
use kube::{
    api::{ListParams, Patch, PatchParams},
    core::ObjectList,
    Api,
};

use crate::internal::{
    client::get_resource_api,
    resources::{create_resource, delete_resource, update_resource},
};

#[tauri::command]
pub async fn get_replication_controllers(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<ReplicationController>, String> {
    let api: Api<ReplicationController> = get_resource_api(context, namespace).await;
    let lp = ListParams::default();
    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}

#[tauri::command]
pub async fn create_replication_controller(
    context: Option<String>,
    resource: ReplicationController,
) -> Result<ReplicationController, String> {
    return create_resource(context, resource).await;
}

#[tauri::command]
pub async fn update_replication_controller(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: ReplicationController,
) -> Result<ReplicationController, String> {
    return update_resource(context, namespace, name, resource).await;
}

#[tauri::command]
pub async fn delete_replication_controller(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    return delete_resource::<ReplicationController>(context, namespace, name).await;
}

#[tauri::command]
pub async fn scale_replication_controller(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    replicas: u8,
) -> Result<bool, String> {
    let api: Api<ReplicationController> = get_resource_api(context, namespace).await;
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
