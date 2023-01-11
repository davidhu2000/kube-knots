#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod namespaces;
mod pods;

use crate::{namespaces::get_namespaces, pods::get_pods};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_pods, get_namespaces])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
