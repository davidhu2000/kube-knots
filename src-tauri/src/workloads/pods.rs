use crate::internal::get_api;
use futures::{SinkExt, StreamExt};
use k8s_openapi::api::core::v1::Pod;
use kube::{
    api::{AttachParams, AttachedProcess, ListParams, LogParams},
    core::ObjectList,
    Api,
};
use log::{error, info};
use std::{net::SocketAddr, time::Duration};
use tokio::net::{TcpListener, TcpStream};
use tokio_tungstenite::{accept_async, tungstenite::Error};
use tungstenite::{Message, Result};

#[tauri::command]
pub async fn get_pods(namespace: Option<String>) -> ObjectList<Pod> {
    let api: Api<Pod> = get_api(namespace).await;
    let lp = ListParams::default();
    return api.list(&lp).await.unwrap();
}

#[tauri::command]
pub async fn get_pod_logs(
    namespace: Option<String>,
    pod_name: String,
    container_name: Option<String>,
) -> String {
    let pods: Api<Pod> = get_api(namespace).await;

    let mut lp = LogParams::default();
    lp.container = container_name;
    let log_string = pods.logs(&pod_name, &lp).await.unwrap();

    return log_string;
}

#[warn(dead_code)]
async fn run_exec_pod_websocket_server(
    namespace: Option<String>,
    pod_name: String,
    container: Option<String>,
) -> String {
    let pods: Api<Pod> = get_api(namespace).await;

    let mut lp = AttachParams::default().stderr(false);
    lp.container = container;

    let attached = pods.exec(&pod_name, vec!["ls"], &lp).await;

    match attached {
        Ok(attached) => {
            let output = get_output(attached).await;
            return output;
        }
        Err(e) => {
            return e.to_string();
        }
    }
}

async fn get_output(mut attached: AttachedProcess) -> String {
    let stdout = tokio_util::io::ReaderStream::new(attached.stdout().unwrap());
    let out = stdout
        .filter_map(|r| async { r.ok().and_then(|v| String::from_utf8(v.to_vec()).ok()) })
        .collect::<Vec<_>>()
        .await
        .join("");
    attached.join().await.unwrap();
    out
}

async fn accept_connection(
    peer: SocketAddr,
    stream: TcpStream,
    namespace: Option<String>,
    pod_name: String,
    container: Option<String>,
) {
    if let Err(e) = handle_connection(peer, stream, namespace, pod_name, container).await {
        match e {
            Error::ConnectionClosed | Error::Protocol(_) | Error::Utf8 => (),
            err => error!("Error processing connection: {}", err),
        }
    }
}

async fn handle_connection(
    peer: SocketAddr,
    stream: TcpStream,
    namespace: Option<String>,
    pod_name: String,
    container: Option<String>,
) -> Result<()> {
    let ws_stream = accept_async(stream).await.expect("Failed to accept");
    // println!("New WebSocket connection: {}", peer);
    let (mut ws_sender, mut ws_receiver) = ws_stream.split();
    // let mut interval = tokio::time::interval(Duration::from_millis(1000));

    let pods: Api<Pod> = get_api(namespace).await;

    let mut lp = AttachParams::default().stderr(false);
    lp.container = container;

    loop {
        tokio::select! {
            msg = ws_receiver.next() => {
                match msg {
                    Some(msg) => {
                        let msg = msg.unwrap();
                        if msg.is_text() ||msg.is_binary() {
                            let attached =  pods.exec(&pod_name, vec![msg.to_string()], &lp).await.unwrap();
                            let output = get_output(attached).await;

                            println!("Received a message from {}: {}", peer, msg);
                            // println!("Received a message from {}: {}", peer, msg);
                            // info!("Received a message from {}: {}", peer, msg);
                            ws_sender.send(Message::Text(output)).await?;
                        } else if msg.is_close() {
                            break;
                        }
                    }
                    None => {
                        println!("Connection {} closed.", peer);
                        break
                    },
                }
            }
            // _ = interval.tick() => {
            //     ws_sender.send(Message::Text("tick".to_owned())).await?;
            // }
        }
    }

    Ok(())
}

#[tauri::command]
pub async fn exec_pod(namespace: Option<String>, pod_name: String, container: Option<String>) {
    let addr = "127.0.0.1:20010";
    let listener = TcpListener::bind(&addr).await.expect("Can't listen");

    // let mut lp = AttachParams::default().stderr(false);
    // lp.container = container;

    // let attached = pods.exec(&pod_name, vec!["ls"], &lp).await;

    while let Ok((stream, _)) = listener.accept().await {
        let peer = stream
            .peer_addr()
            .expect("connected streams should have a peer address");
        // println!("Peer address: {}", peer);
        tokio::spawn(accept_connection(
            peer,
            stream,
            namespace.clone(),
            pod_name.clone(),
            container.clone(),
        ));
    }

    // return 20010;
}
