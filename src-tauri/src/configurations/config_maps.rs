use k8s_openapi::api::core::v1::ConfigMap;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::get_resource_api;

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
