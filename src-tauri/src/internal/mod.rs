use std::process::Command;

use k8s_openapi::NamespaceResourceScope;
use kube::{
    config::{KubeConfigOptions, Kubeconfig},
    Api, Client, Config,
};
use log::warn;

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

    match Command::new("brew").arg("--version").spawn() {
        Ok(e) => {
            warn!("get_client_with_context ok brew --version: {:?}", e);
            let e1 = e.wait_with_output();

            match e1 {
                Ok(e1) => {
                    warn!("get_client_with_context ok brew --version: {:?}", e1);
                }
                Err(e1) => {
                    warn!("get_client_with_context error brew --version: {:?}", e1);
                }
            }
        }
        Err(e) => {
            warn!("get_client_with_context error brew --version: {:?}", e);
        }
    };

    match Command::new("brew").arg("--version").spawn() {
        Ok(e) => {
            warn!("get_client_with_context ok brew --version: {:?}", e);
            let e1 = e.wait_with_output();

            match e1 {
                Ok(e1) => {
                    warn!("get_client_with_context ok brew --version: {:?}", e1);
                }
                Err(e1) => {
                    warn!("get_client_with_context error brew --version: {:?}", e1);
                }
            }
        }
        Err(e) => {
            warn!("get_client_with_context error brew --version: {:?}", e);
        }
    };

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
