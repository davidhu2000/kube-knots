#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod cron_jobs;
mod internal;
mod namespaces;
mod pods;

use crate::{cron_jobs::get_cron_jobs, namespaces::get_namespaces, pods::get_pods};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_cron_jobs,
            get_pods,
            get_namespaces,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
