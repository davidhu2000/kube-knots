import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createReactRouter, createRouteConfig } from "@tanstack/react-router";

import { AppProviders } from "./app-providers";
import { CronJobs } from "./cron-jobs/cron-jobs";
import { Deployments } from "./deployments/deployments";
import { Jobs } from "./jobs/jobs";
import { Layout } from "./layout";
import { Pods } from "./pods/pods";
import { TestPlayground } from "./test-playground/test-playground";

const rootRoute = createRouteConfig({
  component: () => (
    <AppProviders>
      <Layout>
        <Outlet />
      </Layout>
      <ReactQueryDevtools />
    </AppProviders>
  ),
});

const routeConfig = rootRoute.addChildren([
  rootRoute.createRoute({
    path: "/",
    component: () => <div>TODO: figure out what to show by default</div>,
  }),
  rootRoute.createRoute({ path: "/pods", component: Pods }),
  rootRoute.createRoute({ path: "/cron-jobs", component: CronJobs }),
  rootRoute.createRoute({ path: "/deployments", component: Deployments }),
  rootRoute.createRoute({ path: "/jobs", component: Jobs }),
  rootRoute.createRoute({ path: "/test-playground", component: TestPlayground }),
]);
export const router = createReactRouter({ routeConfig });

export const navigationLinks = [
  { name: "Cron Jobs", href: "/cron-jobs" },
  { name: "Deployments", href: "/deployments" },
  { name: "Jobs", href: "/jobs" },
  { name: "Pods", href: "/pods" },
  { name: "Testing", href: "/test-playground" },
] as const;

declare module "@tanstack/react-router" {
  interface RegisterRouter {
    router: typeof router;
  }
}
