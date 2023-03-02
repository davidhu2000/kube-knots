#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use tauri_plugin_log::LogTarget;

mod internal;

pub mod cluster;
pub mod configurations;
pub mod core;
pub mod networking;
pub mod workloads;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            cluster::events::get_events,
            cluster::node_metrics::get_node_metrics,
            cluster::namespaces::get_namespaces,
            cluster::nodes::get_nodes,
            configurations::config_maps::get_config_maps,
            configurations::config_maps::update_config_map,
            configurations::horizontal_pod_autoscalers::get_horizontal_pod_autoscalers,
            configurations::horizontal_pod_autoscalers::update_horizontal_pod_autoscaler,
            configurations::secrets::get_secrets,
            configurations::secrets::update_secret,
            core::config::get_config,
            networking::ingresses::get_ingresses,
            networking::ingresses::update_ingress,
            networking::services::get_services,
            networking::services::update_service,
            workloads::cron_jobs::get_cron_jobs,
            workloads::cron_jobs::update_cron_job,
            workloads::deployments::get_deployments,
            workloads::deployments::update_deployment,
            workloads::deployments::restart_deployment,
            workloads::deployments::scale_deployment,
            workloads::jobs::create_job,
            workloads::jobs::get_jobs,
            workloads::jobs::update_job,
            workloads::pod_metrics::get_pod_metrics,
            workloads::pods::delete_pod,
            workloads::pods::get_pod_logs,
            workloads::pods::get_pods,
            workloads::pods::update_pod,
            workloads::replica_sets::get_replica_sets,
            workloads::replica_sets::scale_replica_set,
            workloads::replica_sets::update_replica_set,
            workloads::stateful_sets::get_stateful_sets,
            workloads::stateful_sets::update_stateful_set,
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
