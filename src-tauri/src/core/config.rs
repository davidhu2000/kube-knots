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

#[tauri::command]
pub async fn set_context(context: String) -> Result<Client, String> {
    let kubeconfig = Kubeconfig::read().unwrap();

    let possible_context = kubeconfig.contexts.iter().find(|c| c.name == context);

    if possible_context.is_none() {
        return Err(format!("Context {} not found", context));
    }

    let options = KubeConfigOptions {
        context: Some(context.clone()),
        cluster: None,
        user: None,
    };

    let config = Config::from_custom_kubeconfig(kubeconfig, &options)
        .await
        .unwrap();

    let a = Client::try_from(config);

    match a {
        Ok(client) => Ok(client),
        Err(e) => Err(e.to_string()),
    }
}
