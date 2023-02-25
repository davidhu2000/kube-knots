use k8s_openapi::api::core::v1::Namespace;

use kube::{
    api::{Api, ListParams, ObjectList},
    Client,
};

// TODO: fix this to take into account the context

#[tauri::command]
pub async fn get_namespaces() -> Result<ObjectList<Namespace>, String> {
    let client = Client::try_default().await.unwrap();

    let api: Api<Namespace> = Api::all(client);
    let lp = ListParams::default();

    let result = api.list(&lp).await;

    return match result {
        Ok(items) => Ok(items),
        Err(e) => Err(e.to_string()),
    };
}
