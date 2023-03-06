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
            // events
            cluster::events::get_events,
            // namespaces
            cluster::namespaces::create_namespace,
            cluster::namespaces::delete_namespace,
            cluster::namespaces::get_namespaces,
            cluster::namespaces::update_namespace,
            // nodes
            cluster::node_metrics::get_node_metrics,
            cluster::nodes::create_node,
            cluster::nodes::cordon_node,
            cluster::nodes::delete_node,
            cluster::nodes::get_nodes,
            cluster::nodes::uncordon_node,
            cluster::nodes::update_node,
            // config maps
            configurations::config_maps::create_config_map,
            configurations::config_maps::delete_config_map,
            configurations::config_maps::get_config_maps,
            configurations::config_maps::update_config_map,
            // horizontal pod autoscalers
            configurations::horizontal_pod_autoscalers::create_horizontal_pod_autoscaler,
            configurations::horizontal_pod_autoscalers::delete_horizontal_pod_autoscaler,
            configurations::horizontal_pod_autoscalers::get_horizontal_pod_autoscalers,
            configurations::horizontal_pod_autoscalers::update_horizontal_pod_autoscaler,
            // secrets
            configurations::secrets::create_secret,
            configurations::secrets::delete_secret,
            configurations::secrets::get_secrets,
            configurations::secrets::update_secret,
            core::config::get_config,
            // ingresses
            networking::ingresses::create_ingress,
            networking::ingresses::delete_ingress,
            networking::ingresses::get_ingresses,
            networking::ingresses::update_ingress,
            // services
            networking::services::create_service,
            networking::services::delete_service,
            networking::services::get_services,
            networking::services::update_service,
            // cronjobs
            workloads::cron_jobs::create_cron_job,
            workloads::cron_jobs::delete_cron_job,
            workloads::cron_jobs::get_cron_jobs,
            workloads::cron_jobs::update_cron_job,
            // daemonsets
            workloads::daemon_sets::create_daemon_set,
            workloads::daemon_sets::delete_daemon_set,
            workloads::daemon_sets::get_daemon_sets,
            workloads::daemon_sets::restart_daemon_set,
            workloads::daemon_sets::update_daemon_set,
            // deployments
            workloads::deployments::create_deployment,
            workloads::deployments::delete_deployment,
            workloads::deployments::get_deployments,
            workloads::deployments::update_deployment,
            workloads::deployments::restart_deployment,
            workloads::deployments::scale_deployment,
            // jobs
            workloads::jobs::create_job,
            workloads::jobs::delete_job,
            workloads::jobs::get_jobs,
            workloads::jobs::update_job,
            // pod metrics
            workloads::pod_metrics::get_pod_metrics,
            // pods
            workloads::pods::create_pod,
            workloads::pods::delete_pod,
            workloads::pods::evict_pod,
            workloads::pods::get_pod_logs,
            workloads::pods::get_pods,
            workloads::pods::update_pod,
            // replica sets
            workloads::replica_sets::create_replica_set,
            workloads::replica_sets::delete_replica_set,
            workloads::replica_sets::get_replica_sets,
            workloads::replica_sets::scale_replica_set,
            workloads::replica_sets::update_replica_set,
            // stateful sets
            workloads::stateful_sets::create_stateful_set,
            workloads::stateful_sets::delete_stateful_set,
            workloads::stateful_sets::get_stateful_sets,
            workloads::stateful_sets::restart_stateful_set,
            workloads::stateful_sets::scale_stateful_set,
            workloads::stateful_sets::update_stateful_set,
        ])
        // .plugin(
        //     tauri_plugin_log::Builder::default()
        //         .targets([LogTarget::LogDir, LogTarget::Stdout])
        //         .build(),
        // )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
