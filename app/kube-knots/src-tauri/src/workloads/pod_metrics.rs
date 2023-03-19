use k8s_openapi::{apimachinery::pkg::api::resource::Quantity, NamespaceResourceScope};
use kube::{
    api::ListParams,
    core::{ObjectList, ObjectMeta},
    Api,
};
use log::error;

use crate::internal::client::get_resource_api;

#[derive(serde::Deserialize, serde::Serialize, Clone, Debug)]
pub struct PodMetricsContainer {
    pub name: String,
    pub usage: PodMetricsContainerUsage,
}

#[derive(serde::Deserialize, serde::Serialize, Clone, Debug)]
pub struct PodMetricsContainerUsage {
    pub cpu: Quantity,
    pub memory: Quantity,
}

#[derive(serde::Deserialize, serde::Serialize, Clone, Debug)]
pub struct PodMetrics {
    pub metadata: ObjectMeta,
    pub timestamp: String,
    pub window: String,
    pub containers: Vec<PodMetricsContainer>,
}

impl k8s_openapi::Resource for PodMetrics {
    const GROUP: &'static str = "metrics.k8s.io";
    const KIND: &'static str = "pod";
    const VERSION: &'static str = "v1beta1";
    const API_VERSION: &'static str = "metrics.k8s.io/v1beta1";
    const URL_PATH_SEGMENT: &'static str = "pods";

    type Scope = NamespaceResourceScope;
}

impl k8s_openapi::Metadata for PodMetrics {
    type Ty = ObjectMeta;

    fn metadata(&self) -> &Self::Ty {
        &self.metadata
    }

    fn metadata_mut(&mut self) -> &mut Self::Ty {
        &mut self.metadata
    }
}

#[tauri::command]
pub async fn get_pod_metrics(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<PodMetrics>, String> {
    // https://github.com/kube-rs/kube/issues/492
    let api: Api<PodMetrics> = get_resource_api(context, namespace).await?;

    let lp = ListParams::default();
    let result = api.list(&lp).await;

    return match result {
        Ok(resource) => Ok(resource),
        Err(e) => {
            error!("get_pod_metrics: {}", e);
            return Err(e.to_string());
        }
    };
}
