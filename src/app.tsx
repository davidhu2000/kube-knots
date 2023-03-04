import { RouterProvider } from "@tanstack/react-router";

import { AppProviders } from "./app-providers";
import { router } from "./router";

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
