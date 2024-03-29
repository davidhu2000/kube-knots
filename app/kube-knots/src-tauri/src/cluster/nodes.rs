use k8s_openapi::api::core::v1::Node;
use kube::{
    api::{DeleteParams, ListParams, Patch, PatchParams},
    core::ObjectList,
    Api,
};
use log::error;

use crate::internal::client::get_client_with_context;

#[tauri::command]
pub async fn get_nodes(context: Option<String>) -> Result<ObjectList<Node>, String> {
    let client = get_client_with_context(context).await?;
    let api = Api::<Node>::all(client);
    let result = api.list(&ListParams::default()).await;

    return match result {
        Ok(resource) => Ok(resource),
        Err(e) => {
            error!("get_nodes: {}", e);
            return Err(e.to_string());
        }
    };
}

#[tauri::command]
pub async fn create_node(context: Option<String>, resource: Node) -> Result<Node, String> {
    let client = get_client_with_context(context).await?;
    let api: Api<Node> = Api::all(client);
    let result = api.create(&Default::default(), &resource).await;

    return match result {
        Ok(resource) => Ok(resource),
        Err(e) => {
            error!("create_node: {}", e);
            return Err(e.to_string());
        }
    };
}

#[tauri::command]
pub async fn update_node(
    context: Option<String>,
    name: String,
    resource: Node,
) -> Result<Node, String> {
    let client = get_client_with_context(context).await?;
    let api: Api<Node> = Api::all(client);
    let result = api
        .patch(&name, &PatchParams::default(), &Patch::Merge(&resource))
        .await;

    return match result {
        Ok(resource) => Ok(resource),
        Err(e) => {
            error!("update_node: {}", e);
            return Err(e.to_string());
        }
    };
}

#[tauri::command]
pub async fn delete_node(context: Option<String>, name: String) -> Result<bool, String> {
    let client = get_client_with_context(context).await?;
    let api: Api<Node> = Api::all(client);
    let result = api.delete(&name, &DeleteParams::default()).await;

    return match result {
        Ok(_) => Ok(true),
        Err(e) => {
            error!("delete_node: {}", e);
            return Err(e.to_string());
        }
    };
}

#[tauri::command]
pub async fn cordon_node(context: Option<String>, name: String) -> Result<Node, String> {
    let client = get_client_with_context(context).await?;

    let api = Api::<Node>::all(client);
    let result = api.cordon(&name).await;

    return match result {
        Ok(resource) => Ok(resource),
        Err(e) => {
            error!("cordon_node: {}", e);
            return Err(e.to_string());
        }
    };
}

#[tauri::command]
pub async fn uncordon_node(context: Option<String>, name: String) -> Result<Node, String> {
    let client = get_client_with_context(context).await?;

    let api = Api::<Node>::all(client);
    let result = api.uncordon(&name).await;

    return match result {
        Ok(resource) => Ok(resource),
        Err(e) => {
            error!("uncordon_node: {}", e);
            return Err(e.to_string());
        }
    };
}
