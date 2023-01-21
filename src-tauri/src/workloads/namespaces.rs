use k8s_openapi::api::core::v1::Namespace;

use kube::{
    api::{Api, ListParams, ObjectList},
    Client,
};

#[tauri::command]
pub async fn get_namespaces() -> ObjectList<Namespace> {
    let client = Client::try_default().await.unwrap();

    let namespaces: Api<Namespace> = Api::all(client);
    let lp = ListParams::default();

    return namespaces.list(&lp).await.unwrap();
}
