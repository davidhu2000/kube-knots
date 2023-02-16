import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazy, Outlet, ReactRouter, RootRoute, Route } from "@tanstack/react-router";

import { AppProviders } from "./app-providers";
import { Layout } from "./layout";

// import { Ingresses } from "./networking/ingresses";

// import { Services } from "./networking/services";

// import { CronJobs } from "./workloads/cron-jobs";

// import { Deployments } from "./workloads/deployments";

// import { Jobs } from "./workloads/jobs";

// import { Pods } from "./workloads/pods";
// import { ReplicaSets } from "./workloads/replica-sets";
// import { StatefulSets } from "./workloads/stateful-sets";

const Ingresses = lazy(() =>
  import("./networking/ingresses").then((module) => ({ default: module.Ingresses }))
);
const Services = lazy(() =>
  import("./networking/services").then((module) => ({ default: module.Services }))
);
const CronJobs = lazy(() =>
  import("./workloads/cron-jobs").then((module) => ({ default: module.CronJobs }))
);
const Deployments = lazy(() =>
  import("./workloads/deployments").then((module) => ({ default: module.Deployments }))
);
const Jobs = lazy(() => import("./workloads/jobs").then((module) => ({ default: module.Jobs })));
const Pods = lazy(() => import("./workloads/pods").then((module) => ({ default: module.Pods })));
const ReplicaSets = lazy(() =>
  import("./workloads/replica-sets").then((module) => ({ default: module.ReplicaSets }))
);
const StatefulSets = lazy(() =>
  import("./workloads/stateful-sets").then((module) => ({ default: module.StatefulSets }))
);

const rootRoute = new RootRoute({
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

export const networkingRoutes = [
  { name: "Ingresses", path: "/ingresses", component: Ingresses },
  { name: "Services", path: "/services", component: Services },
] as const;

const routeTree = rootRoute.addChildren([
  new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: () => <div>TODO: figure out what to show by default</div>,
  }),
  ...workloadsRoutes.map((route) => new Route({ ...route, getParentRoute: () => rootRoute })),
  ...networkingRoutes.map((route) => new Route({ ...route, getParentRoute: () => rootRoute })),
]);

export const router = new ReactRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface RegisterRouter {
    router: typeof router;
  }
}
