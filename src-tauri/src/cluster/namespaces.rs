use k8s_openapi::api::core::v1::Namespace;
use kube::api::{Api, ListParams, ObjectList};

use crate::internal::get_client_with_context;

#[tauri::command]
pub async fn get_namespaces(context: Option<String>) -> Result<ObjectList<Namespace>, String> {
    let client = get_client_with_context(context).await;
    let api: Api<Namespace> = Api::all(client);

    let lp = ListParams::default();

    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}
