#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

use k8s_openapi::api::core::v1::Pod;

use kube::{
    api::{Api, ListParams, ObjectList},
    Client,
};

#[tauri::command]
async fn get_pods() -> ObjectList<Pod> {
    let client = Client::try_default().await.unwrap();

    let pods: Api<Pod> = Api::default_namespaced(client);

    let lp = ListParams::default();
    let pod = pods.list(&lp).await.unwrap();

    // log pod to terminal
    // println!("{:#?}", pod);

    pod

    // Into::<ObjectList<Pod>>::into(pod);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_pods])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
