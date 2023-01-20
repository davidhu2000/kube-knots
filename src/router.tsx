import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, ReactRouter, createRouteConfig } from "@tanstack/react-router";

import { AppProviders } from "./app-providers";
import { CronJobs } from "./cron-jobs/cron-jobs";
import { Deployments } from "./deployments/deployments";
import { Jobs } from "./jobs/jobs";
import { Layout } from "./layout";
import { Pods } from "./pods/pods";
import { ReplicaSets } from "./replica-sets/replica-sets";
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

export const routes = [
  { name: "Cron Jobs", path: "/cron-jobs", component: CronJobs },
  { name: "Deployments", path: "/deployments", component: Deployments },
  { name: "Jobs", path: "/jobs", component: Jobs },
  { name: "Pods", path: "/pods", component: Pods },
  { name: "Replica Sets", path: "/replica-sets", component: ReplicaSets },
  { name: "Testing", path: "/test-playground", component: TestPlayground },
] as const;

const routeConfig = rootRoute.addChildren([
  rootRoute.createRoute({
    path: "/",
    component: () => <div>TODO: figure out what to show by default</div>,
  }),
  ...routes.map((route) => rootRoute.createRoute(route)),
]);

export const router = new ReactRouter({ routeConfig });

declare module "@tanstack/react-router" {
  interface RegisterRouter {
    router: typeof router;
  }
}
