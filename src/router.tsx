import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createReactRouter, createRouteConfig } from "@tanstack/react-router";

import { AppProviders } from "./app-providers";
import { CronJobs } from "./cron-jobs/cron-jobs";
import { Layout } from "./layout";
import { Pods } from "./pods/pods";

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

const homeRoute = rootRoute.createRoute({
  path: "/",
  component: () => <div>TODO: figure out what to show by default</div>,
});

const podsRoute = rootRoute.createRoute({
  path: "/pods",
  component: Pods,
});

const cronJobsRoute = rootRoute.createRoute({
  path: "/cron-jobs",
  component: CronJobs,
});

const routeConfig = rootRoute.addChildren([homeRoute, podsRoute, cronJobsRoute]);
export const router = createReactRouter({ routeConfig });

declare module "@tanstack/react-router" {
  interface RegisterRouter {
    router: typeof router;
  }
}
