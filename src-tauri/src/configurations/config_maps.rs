use k8s_openapi::api::core::v1::ConfigMap;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::{
    client::get_resource_api,
    resources::{create_resource, delete_resource, update_resource},
};

#[tauri::command]
pub async fn get_config_maps(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<ConfigMap>, String> {
    let api: Api<ConfigMap> = get_resource_api(context, namespace).await;
    let lp = ListParams::default();
    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}

#[tauri::command]
pub async fn create_config_map(
    context: Option<String>,
    resource: ConfigMap,
) -> Result<ConfigMap, String> {
    return create_resource(context, resource).await;
}

#[tauri::command]
pub async fn update_config_map(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: ConfigMap,
) -> Result<ConfigMap, String> {
    return update_resource(context, namespace, name, resource).await;
}

#[tauri::command]
pub async fn delete_config_map(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    return delete_resource::<ConfigMap>(context, namespace, name).await;
}
