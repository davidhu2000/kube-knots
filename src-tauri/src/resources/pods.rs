use k8s_openapi::api::core::v1::Pod;

use kube::{api::LogParams, core::ObjectList, Api, Client};

use super::internal::get_resource_list;

#[tauri::command]
pub async fn get_pods(namespace: Option<String>) -> ObjectList<Pod> {
    return get_resource_list(namespace).await;
}

#[tauri::command]
pub async fn get_pod_logs(pod_name: String, container_name: Option<String>) -> String {
    let client = Client::try_default().await.unwrap();

    let pods: Api<Pod> = Api::default_namespaced(client);

    let mut lp = LogParams::default();

    lp.container = container_name;

    let log_string = pods.logs(&pod_name, &lp).await.unwrap();

    // print log_string
    println!("{}", log_string);

    return log_string;
}
