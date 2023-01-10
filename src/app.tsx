import { invoke } from "@tauri-apps/api";
import { useEffect } from "react";

export function App() {
  useEffect(() => {
    invoke("get_pods").then((res) => {
      console.log("get_pods: ");
      console.log(res);
    });
  });

  return (
    <div className="container">
      <h1>Kube Knots</h1>
    </div>
  );
}
