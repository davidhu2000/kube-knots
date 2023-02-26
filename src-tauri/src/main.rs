#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use log::warn;
use tauri_plugin_log::LogTarget;

mod internal;

pub mod cluster;
pub mod core;
pub mod networking;
pub mod workloads;

use std::process::{Child, Command};

fn main() {
    let mut a: Child = Command::new("which")
        .arg("gke-gcloud-auth-plugin")
        .spawn()
        .expect("gke command failed to start");
    warn!("status: {}", a.wait().unwrap());

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            cluster::events::get_events,
            cluster::node_metrics::get_node_metrics,
            cluster::namespaces::get_namespaces,
            cluster::nodes::get_nodes,
            core::config::get_config,
            networking::ingresses::get_ingresses,
            networking::services::get_services,
            workloads::cron_jobs::get_cron_jobs,
            workloads::deployments::get_deployments,
            workloads::deployments::restart_deployment,
            workloads::deployments::scale_deployment,
            workloads::jobs::create_job,
            workloads::jobs::get_jobs,
            workloads::pod_metrics::get_pod_metrics,
            workloads::pods::get_pod_logs,
            workloads::pods::get_pods,
            workloads::replica_sets::get_replica_sets,
            workloads::stateful_sets::get_stateful_sets,
            workloads::stateful_sets::restart_stateful_set,
            workloads::stateful_sets::scale_stateful_set,
        ])
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::LogDir, LogTarget::Stdout])
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
