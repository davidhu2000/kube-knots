#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod resources;

use crate::resources::{
    cron_jobs::get_cron_jobs, deployments::get_deployments, namespaces::get_namespaces,
    pods::get_pods,
};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_cron_jobs,
            get_deployments,
            get_pods,
            get_namespaces,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
