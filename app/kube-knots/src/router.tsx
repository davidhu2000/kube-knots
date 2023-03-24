import { Outlet, ReactRouter, RootRoute, Route } from "@tanstack/react-router";

import { Events } from "./clusters/events";
import { Namespaces } from "./clusters/namespaces";
import { Nodes } from "./clusters/nodes";
import { ConfigMaps } from "./configurations/config-maps";
import { ConfigurationOverview } from "./configurations/configuration-overview";
import { HorizontalPodAutoscalers } from "./configurations/horizontal-pod-autoscalers";
import { PodDisruptionBudgets } from "./configurations/pod-disruption-budgets";
import { Secrets } from "./configurations/secrets";
import { Layout } from "./layout";
import { Ingresses } from "./networking/ingresses";
import { NetworkingOverview } from "./networking/networking-overview";
import { Services } from "./networking/services";
import { MetricsOverview } from "./root-view/metrics-overview";
import { ResourcesOverview } from "./root-view/resources-overview";
import { CronJobs } from "./workloads/cron-jobs";
import { DaemonSets } from "./workloads/daemon-sets";
import { Deployments } from "./workloads/deployments";
import { Jobs } from "./workloads/jobs";
import { Pods } from "./workloads/pods";
import { ReplicaSets } from "./workloads/replica-sets";
import { ReplicationControllers } from "./workloads/replication-controllers";
import { StatefulSets } from "./workloads/stateful-sets";
import { WorkloadOverview } from "./workloads/workload-overview";

const rootRoute = new RootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

export const workloadsRoutes = [
  { name: "Cron Jobs", path: "/cron-jobs", component: CronJobs },
  { name: "Daemon Sets", path: "/daemon-sets", component: DaemonSets },
  { name: "Deployments", path: "/deployments", component: Deployments },
  { name: "Jobs", path: "/jobs", component: Jobs },
  { name: "Pods", path: "/pods", component: Pods },
  { name: "Replica Sets", path: "/replica-sets", component: ReplicaSets },
  {
    name: "Replication Controllers",
    path: "/replication-controllers",
    component: ReplicationControllers,
  },
  { name: "Stateful Sets", path: "/stateful-sets", component: StatefulSets },
] as const;

export const networkingRoutes = [
  { name: "Ingresses", path: "/ingresses", component: Ingresses },
  { name: "Services", path: "/services", component: Services },
] as const;

export const configurationRoutes = [
  { name: "Config Maps", path: "/config-maps", component: ConfigMaps },
  { name: "HPAs", path: "/horizontal-pod-autoscalers", component: HorizontalPodAutoscalers },
  {
    name: "Pod Disruption Budgets",
    path: "/pod-disruption-budgets",
    component: PodDisruptionBudgets,
  },
  { name: "Secrets", path: "/secrets", component: Secrets },
] as const;

export const clusterRoutes = [
  { name: "Namespaces", path: "/namespaces", component: Namespaces },
  { name: "Events", path: "/events", component: Events },
  { name: "Nodes", path: "/nodes", component: Nodes },
];

const overviewRoutes = [
  { name: "Networking Overview", path: "/networking-overview", component: NetworkingOverview },
  { name: "Workload Overview", path: "/workload-overview", component: WorkloadOverview },
  { name: "Config Overview", path: "/configuration-overview", component: ConfigurationOverview },
];

export const allRoutes = [
  { name: "Metrics", path: "/metrics", component: MetricsOverview },
  { name: "Resources", path: "/all-resources", component: ResourcesOverview },
];

const routeTree = rootRoute.addChildren([
  new Route({
    getParentRoute: () => rootRoute,
    path: "/",
    component: MetricsOverview,
  }),
  ...[
    workloadsRoutes,
    networkingRoutes,
    configurationRoutes,
    clusterRoutes,
    allRoutes,
    overviewRoutes,
  ].flatMap((routes) =>
    routes.map((route) => new Route({ ...route, getParentRoute: () => rootRoute }))
  ),
]);

export const router = new ReactRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface RegisterRouter {
    router: typeof router;
  }
}
