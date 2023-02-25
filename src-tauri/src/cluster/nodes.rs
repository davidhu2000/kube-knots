use k8s_openapi::api::core::v1::Node;
use kube::{
    api::ListParams,
    core::{ObjectList, Request},
    Client,
};

#[tauri::command]
pub async fn get_nodes() -> Result<ObjectList<Node>, String> {
    let client = Client::try_default().await.unwrap();
    let request = Request::new("/api/v1/nodes");
    let result = client
        .clone()
        .request::<ObjectList<Node>>(request.list(&ListParams::default()).unwrap())
        .await;

    return match result {
        Ok(nodes) => Ok(nodes),
        Err(e) => Err(format!("Error getting nodes: {}", e)),
    };
}
