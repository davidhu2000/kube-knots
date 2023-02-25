#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod internal;

pub mod cluster;
pub mod networking;
pub mod workloads;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            cluster::events::get_events,
            cluster::node_metrics::get_node_metrics,
            cluster::nodes::get_nodes,
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
            workloads::namespaces::get_namespaces,
            workloads::replica_sets::get_replica_sets,
            workloads::stateful_sets::get_stateful_sets,
            workloads::stateful_sets::restart_stateful_set,
            workloads::stateful_sets::scale_stateful_set,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
