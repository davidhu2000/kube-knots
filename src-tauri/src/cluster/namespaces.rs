use k8s_openapi::api::core::v1::Namespace;
use kube::api::{Api, DeleteParams, ListParams, ObjectList, Patch, PatchParams};

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

#[tauri::command]
pub async fn create_namespace(
    context: Option<String>,
    resource: Namespace,
) -> Result<Namespace, String> {
    let client = get_client_with_context(context).await;
    let api: Api<Namespace> = Api::all(client);
    let result = api.create(&Default::default(), &resource).await;

    return match result {
        Ok(resource) => Ok(resource),
        Err(e) => Err(e.to_string()),
    };
}

#[tauri::command]
pub async fn update_namespace(
    context: Option<String>,
    name: String,
    resource: Namespace,
) -> Result<Namespace, String> {
    let client = get_client_with_context(context).await;
    let api: Api<Namespace> = Api::all(client);
    let result = api
        .patch(&name, &PatchParams::default(), &Patch::Merge(&resource))
        .await;

    return match result {
        Ok(resource) => Ok(resource),
        Err(e) => Err(e.to_string()),
    };
}

#[tauri::command]
pub async fn delete_namespace(context: Option<String>, name: String) -> Result<bool, String> {
    let client = get_client_with_context(context).await;
    let api: Api<Namespace> = Api::all(client);
    let result = api.delete(&name, &DeleteParams::default()).await;

    return match result {
        Ok(_) => Ok(true),
        Err(e) => Err(e.to_string()),
    };
}
