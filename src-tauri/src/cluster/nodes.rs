use k8s_openapi::api::core::v1::Node;
use kube::{
    api::ListParams,
    core::{ObjectList, Request},
};

use crate::internal::get_client_with_context;

#[tauri::command]
pub async fn get_nodes(context: Option<String>) -> Result<ObjectList<Node>, String> {
    let client = get_client_with_context(context).await;

    let request = Request::new("/api/v1/nodes");
    let result = client
        .request::<ObjectList<Node>>(request.list(&ListParams::default()).unwrap())
        .await;

    return match result {
        Ok(nodes) => Ok(nodes),
        Err(e) => Err(format!("Error getting nodes: {}", e)),
    };
}
