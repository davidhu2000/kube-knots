use k8s_openapi::api::networking::v1::Ingress;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::get_resource_api;

#[tauri::command]
pub async fn get_ingresses(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<Ingress>, String> {
    let api: Api<Ingress> = get_resource_api(context, namespace).await;
    let lp = ListParams::default();

    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}
