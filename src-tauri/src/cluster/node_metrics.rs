use kube::{
    api::ListParams,
    core::{ObjectList, Request},
    Client,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Usage {
    pub cpu: String,
    pub memory: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodeMetrics {
    metadata: kube::api::ObjectMeta,
    usage: Usage,
    timestamp: String,
    window: String,
}

// TODO: fix this to take into account the context

#[tauri::command]
pub async fn get_node_metrics() -> Result<ObjectList<NodeMetrics>, String> {
    let client = Client::try_default().await.unwrap();
    let request = Request::new("/apis/metrics.k8s.io/v1beta1/nodes");
    let result = client
        .clone()
        .request::<ObjectList<NodeMetrics>>(request.list(&ListParams::default()).unwrap())
        .await;

    return match result {
        Ok(metrics) => Ok(metrics),
        Err(e) => Err(format!("Error getting node metrics: {}", e)),
    };
}
