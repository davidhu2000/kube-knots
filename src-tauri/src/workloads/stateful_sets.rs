use k8s_openapi::api::apps::v1::StatefulSet;
use kube::{api::ListParams, core::ObjectList, Api};

use crate::internal::get_api;

#[tauri::command]
pub async fn get_stateful_sets(namespace: Option<String>) -> ObjectList<StatefulSet> {
    let api: Api<StatefulSet> = get_api(namespace).await;
    let lp = ListParams::default();
    return api.list(&lp).await.unwrap();
}

#[tauri::command]
pub async fn restart_stateful_set(namespace: Option<String>, name: String) -> bool {
    let api: Api<StatefulSet> = get_api(namespace).await;
    let resource = api.restart(&name).await;

    let result = match resource {
        Ok(_resource) => true,
        Err(err) => {
            println!("Error restarting stateful set: {}", err);
            return false;
        }
    };
    return result;
}
