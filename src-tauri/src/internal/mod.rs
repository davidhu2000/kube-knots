use std::process::{Child, Command};

use k8s_openapi::NamespaceResourceScope;
use kube::{
    config::{KubeConfigOptions, Kubeconfig},
    Api, Client, Config,
};
use tracing::warn;

pub async fn get_resource_api<T>(context: Option<String>, namespace: Option<String>) -> Api<T>
where
    T: serde::de::DeserializeOwned
        + std::fmt::Debug
        + Clone
        + k8s_openapi::Metadata
        + kube::Resource<Scope = NamespaceResourceScope>,
    <T as kube::Resource>::DynamicType: std::default::Default,
{
    let client = get_client_with_context(context).await;

    warn!("get_resource_api called");

    let api: Api<T> = match namespace {
        Some(ns) => Api::<T>::namespaced(client, &ns),
        None => Api::<T>::all(client),
    };
    return api;
}

pub async fn get_client_with_context(context: Option<String>) -> Client {
    let kubeconfig = Kubeconfig::read().unwrap();

    // let c: Child = Command::new("echo")
    //     .arg("$PATH")
    //     .spawn()
    //     .expect("echo command failed to start");
    // warn!(
    //     "get_client_with_context status echo: {:?}",
    //     c.wait_with_output().unwrap()
    // );

    // let a: Child = Command::new("which")
    //     .arg("brew")
    //     .spawn()
    //     .expect("brew command failed to start");
    // warn!(
    //     "get_client_with_context status which brew: {:?}",
    //     a.wait_with_output().unwrap()
    );

    let e: Child = Command::new("brew")
        .arg("--version")
        .spawn()
        .expect("brew command failed to start");
    warn!(
        "get_client_with_context status brew --version: {:?}",
        e.wait_with_output().unwrap()
    );

    // let a: Child = Command::new("which")
    //     .arg("gke-gcloud-auth-plugin")
    //     .spawn()
    //     .expect("gke command failed to start");
    // warn!(
    //     "get_client_with_context status which gke-gcloud-auth-plugin: {:?}",
    //     a.wait_with_output().unwrap()
    // );

    let b: Child = Command::new("gke-gcloud-auth-plugin")
        .spawn()
        .expect("gke command failed to start");
    warn!(
        "get_client_with_context status gke: {:?}",
        b.wait_with_output().unwrap()
    );

    warn!("get_client_with_context 1");

    let client = match context {
        Some(c) => {
            warn!("get_client_with_context 2");

            let options = KubeConfigOptions {
                context: Some(c.clone()),
                cluster: None,
                user: None,
            };

            warn!("get_client_with_context 3");

            let config = Config::from_custom_kubeconfig(kubeconfig, &options)
                .await
                .unwrap();

            warn!("get_client_with_context 4: {:?}", config);

            let c = Client::try_from(config);

            let c = match c {
                Ok(c) => c,
                Err(e) => {
                    warn!("get_client_with_context error: {:?}", e);
                    Client::try_default().await.unwrap()
                }
            };

            warn!("get_client_with_context 5");
            c
        }
        None => Client::try_default().await.unwrap(),
    };

    warn!("get_client_with_context returning client");

    return client;
}
