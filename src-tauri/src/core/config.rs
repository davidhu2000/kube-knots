use kube::config::Kubeconfig;
use log::warn;
use tauri::api::process::Command;

#[tauri::command]
pub fn get_config() {
    match Command::new("brew").arg("--version").spawn() {
        Ok(e) => {
            warn!("get_client_with_context ok 1 brew --version: {:?}", e);
            let e1 = e.wait_with_output();

            match e1 {
                Ok(e1) => {
                    warn!("get_client_with_context ok 2 brew --version: {:?}", e1);
                }
                Err(e1) => {
                    warn!("get_client_with_context error 2 brew --version: {:?}", e1);
                }
            }
        }
        Err(e) => {
            warn!("get_client_with_context error 1 brew --version: {:?}", e);
        }
    };

    // let result = Kubeconfig::read();

    // return match result {
    //     Ok(kubeconfig) => Ok(kubeconfig),
    //     Err(e) => Err(e.to_string()),
    // };
}
