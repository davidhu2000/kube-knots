import { getVersion } from "@tauri-apps/api/app";
import { useEffect } from "react";

declare global {
  interface Window {
    umami: (event: string) => void;
  }
}

async function trackAppVersion() {
  const appVersion = await getVersion();
  window.umami(`v${appVersion}`);
}

export function useTelemetry() {
  useEffect(() => {
    trackAppVersion();
  }, []);
}
