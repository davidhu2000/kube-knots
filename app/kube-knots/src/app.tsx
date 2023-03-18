import { RouterProvider } from "@tanstack/react-router";
import { relaunch } from "@tauri-apps/api/process";
import { checkUpdate, installUpdate } from "@tauri-apps/api/updater";
import { useEffect } from "react";
import { toast } from "react-toastify";

import { AppProviders } from "./app-providers";
import { router } from "./router";

async function update() {
  try {
    const { shouldUpdate } = await checkUpdate();
    if (shouldUpdate) {
      // display dialog
      await installUpdate();
      // install complete, restart the app
      await relaunch();
    }
  } catch (error) {
    console.log(error);
    toast.error(`Failed to update with error: ${error}`);
  }
}

export function App() {
  useEffect(() => {
    update();
  }, []);

  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
