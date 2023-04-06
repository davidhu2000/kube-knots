import { getVersion } from "@tauri-apps/api/app";
import { useEffect } from "react";

declare global {
  interface Window {
    umami?: {
      track: (event: string) => void;
    };
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function trackAppVersion() {
  const appVersion = await getVersion();
  let currentWaitTime = 0;
  while (typeof window.umami?.track !== "function") {
    currentWaitTime += 1000;
    console.log("Waiting for window.umami to be defined...");
    await sleep(1000);
    if (currentWaitTime > 10000) {
      return;
    }
  }

  window.umami.track(`v${appVersion}`);
}

export function useTelemetry() {
  useEffect(() => {
    trackAppVersion();
  }, []);
}
