#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod pods;

use crate::pods::get_pods;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_pods])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
