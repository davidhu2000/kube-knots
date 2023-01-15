import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api";

export function TestPlayground() {
  const result = useQuery(["logs"], () => {
    return invoke<string>("get_pod_logs", {
      podName: "hello-minikube-7ddcbc9b8b-bs8k4",
      containerName: "echo-server",
    });
  });

  return (
    <div>
      <h2>For testing out changes</h2>

      <pre>{result.data}</pre>
    </div>
  );
}
