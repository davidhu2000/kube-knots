use k8s_openapi::api::core::v1::Pod;

use kube::{
    api::{Api, ListParams, ObjectList},
    Client,
};

#[tauri::command]
pub async fn get_pods(namespace: Option<String>) -> ObjectList<Pod> {
    let client = Client::try_default().await.unwrap();

    // match namespace
    let pods: Api<Pod> = match namespace {
        Some(ns) => Api::namespaced(client, &ns),
        None => Api::all(client),
    };

    let lp = ListParams::default();
    return pods.list(&lp).await.unwrap();
}
