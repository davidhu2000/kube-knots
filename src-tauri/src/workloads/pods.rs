use futures::StreamExt;
use k8s_openapi::api::core::v1::Pod;
use kube::{
    api::{AttachParams, AttachedProcess, ListParams, LogParams},
    core::ObjectList,
    Api,
};

use crate::internal::get_api;

#[tauri::command]
pub async fn get_pods(namespace: Option<String>) -> ObjectList<Pod> {
    let api: Api<Pod> = get_api(namespace).await;
    let lp = ListParams::default();
    return api.list(&lp).await.unwrap();
}

#[tauri::command]
pub async fn get_pod_logs(
    namespace: Option<String>,
    pod_name: String,
    container_name: Option<String>,
) -> String {
    let pods: Api<Pod> = get_api(namespace).await;

    let mut lp = LogParams::default();
    lp.container = container_name;
    let log_string = pods.logs(&pod_name, &lp).await.unwrap();

    return log_string;
}

#[tauri::command]
pub async fn exec_pod(
    namespace: Option<String>,
    pod_name: String,
    container: Option<String>,
    command: String,
) -> String {
    let pods: Api<Pod> = get_api(namespace).await;

    let mut lp = AttachParams::default().stderr(false);
    lp.container = container;

    let attached = pods.exec(&pod_name, vec![command], &lp).await;

    match attached {
        Ok(attached) => {
            let output = get_output(attached).await;
            return output;
        }
        Err(e) => {
            return e.to_string();
        }
    }
}

async fn get_output(mut attached: AttachedProcess) -> String {
    let stdout = tokio_util::io::ReaderStream::new(attached.stdout().unwrap());
    let out = stdout
        .filter_map(|r| async { r.ok().and_then(|v| String::from_utf8(v.to_vec()).ok()) })
        .collect::<Vec<_>>()
        .await
        .join("");
    attached.join().await.unwrap();
    out
}
