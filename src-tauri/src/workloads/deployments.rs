use k8s_openapi::api::apps::v1::Deployment;
use kube::{core::ObjectList, Api};

use crate::internal::{
    client::get_resource_api,
    resources::{create_resource, delete_resource, get_resources, scale_resource, update_resource},
};

#[tauri::command]
pub async fn get_deployments(
    context: Option<String>,
    namespace: Option<String>,
) -> Result<ObjectList<Deployment>, String> {
    return get_resources::<Deployment>(context, namespace).await;
}

#[tauri::command]
pub async fn create_deployment(
    context: Option<String>,
    resource: Deployment,
) -> Result<Deployment, String> {
    return create_resource(context, resource).await;
}

#[tauri::command]
pub async fn update_deployment(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    resource: Deployment,
) -> Result<Deployment, String> {
    return update_resource(context, namespace, name, resource).await;
}

#[tauri::command]
pub async fn delete_deployment(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    return delete_resource::<Deployment>(context, namespace, name).await;
}

#[tauri::command]
pub async fn restart_deployment(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
) -> Result<bool, String> {
    let api: Api<Deployment> = get_resource_api(context, namespace).await;
    let resource = api.restart(&name).await;

    return match resource {
        Ok(_resource) => Ok(true),
        Err(err) => {
            println!("Error restarting deployment: {}", err);
            return Err(err.to_string());
        }
    };
}

#[tauri::command]
pub async fn scale_deployment(
    context: Option<String>,
    namespace: Option<String>,
    name: String,
    replicas: u8,
) -> Result<bool, String> {
    return scale_resource::<Deployment>(context, namespace, name, replicas).await;
}
