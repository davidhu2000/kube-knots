#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod resources;

use crate::resources::{cron_jobs, deployments, jobs, namespaces, pods};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            cron_jobs::get_cron_jobs,
            deployments::get_deployments,
            jobs::get_jobs,
            pods::get_pod_logs,
            pods::get_pods,
            namespaces::get_namespaces,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
