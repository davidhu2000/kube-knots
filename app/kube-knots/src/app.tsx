import { RouterProvider } from "@tanstack/react-router";

import { AppProviders } from "./app-providers";
import { router } from "./router";
import { useTelemetry } from "./telemetry";

export function App() {
  useTelemetry();

  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
