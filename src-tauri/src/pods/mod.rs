use k8s_openapi::api::core::v1::Pod;

use kube::{
    api::{Api, ListParams, ObjectList},
    Client,
};

#[tauri::command]
pub async fn get_pods() -> ObjectList<Pod> {
    let client = Client::try_default().await.unwrap();

    let pods: Api<Pod> = Api::default_namespaced(client);

    let lp = ListParams::default();
    return pods.list(&lp).await.unwrap();
}
