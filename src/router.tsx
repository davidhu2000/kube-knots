import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, ReactRouter, createRouteConfig } from "@tanstack/react-router";

import { AppProviders } from "./app-providers";
import { Layout } from "./layout";
import { Ingresses } from "./service/ingresses/ingresses";
import { TestPlayground } from "./test-playground/test-playground";
import { CronJobs } from "./workloads/cron-jobs/cron-jobs";
import { Deployments } from "./workloads/deployments/deployments";
import { Jobs } from "./workloads/jobs/jobs";
import { Pods } from "./workloads/pods/pods";
import { ReplicaSets } from "./workloads/replica-sets/replica-sets";
import { StatefulSets } from "./workloads/stateful-sets/stateful-sets";

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

export const workloadsRoutes = [
  { name: "Cron Jobs", path: "/cron-jobs", component: CronJobs },
  { name: "Deployments", path: "/deployments", component: Deployments },
  { name: "Jobs", path: "/jobs", component: Jobs },
  { name: "Pods", path: "/pods", component: Pods },
  { name: "Replica Sets", path: "/replica-sets", component: ReplicaSets },
  { name: "Stateful Sets", path: "/stateful-sets", component: StatefulSets },
] as const;

export const serviceRoutes = [{ name: "Ingresses", path: "/ingresses", component: Ingresses }];

export const todoRoutes = [
  { name: "Testing", path: "/test-playground", component: TestPlayground },
];

const routeConfig = rootRoute.addChildren([
  rootRoute.createRoute({
    path: "/",
    component: () => <div>TODO: figure out what to show by default</div>,
  }),
  ...workloadsRoutes.map((route) => rootRoute.createRoute(route)),
  ...serviceRoutes.map((route) => rootRoute.createRoute(route)),
  ...todoRoutes.map((route) => rootRoute.createRoute(route)),
]);

export const router = new ReactRouter({ routeConfig });

declare module "@tanstack/react-router" {
  interface RegisterRouter {
    router: typeof router;
  }
}
