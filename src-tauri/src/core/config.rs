use kube::{
    config::{KubeConfigOptions, Kubeconfig},
    Client, Config,
};

#[tauri::command]
pub fn get_config() -> Result<Kubeconfig, String> {
    let result = Kubeconfig::read();

    return match result {
        Ok(kubeconfig) => Ok(kubeconfig),
        Err(e) => Err(e.to_string()),
    };
}
