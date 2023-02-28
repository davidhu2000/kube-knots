import { Cog8ToothIcon } from "@heroicons/react/20/solid";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link } from "@tanstack/react-router";
import { lazy, Suspense, useState, type PropsWithChildren } from "react";

import { Context, ContextSwitcher } from "./core/contexts";
import { NamespaceSelect } from "./namespaces/namespace-select";
import { clusterRoutes, networkingRoutes, workloadsRoutes } from "./router";

const Settings = lazy(() =>
  import("./settings/settings").then((module) => ({ default: module.Settings }))
);

export function Layout({ children }: PropsWithChildren) {
  const sections = [
    { title: "Workload", routes: workloadsRoutes },
    { title: "Networking", routes: networkingRoutes },
    { title: "Cluster", routes: clusterRoutes },
  ];

  const [showSetting, setShowSetting] = useState(false);
  const [showContextSwitcher, setShowContextSwitcher] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="fixed inset-y-0 flex w-40 flex-col bg-gray-200 dark:bg-gray-700 dark:text-gray-100">
        <div className="flex h-16 items-center px-4 font-medium">
          {/* TODO: update logo */}
          <DocumentMagnifyingGlassIcon className="mr-2 h-6 w-6" aria-hidden="true" />
          Kube Knots
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 p-4">
            {sections.map(({ title, routes }) => (
              <span key={title}>
                <h1 className="mt-4 font-bold">{title}</h1>
                {routes.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="group flex items-center rounded-md p-2 text-sm font-medium text-gray-800 hover:bg-gray-400 dark:text-gray-100 hover:dark:bg-gray-500"
                    search={{}}
                    params={{}}
                  >
                    {item.name}
                  </Link>
                ))}
              </span>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex flex-col pl-40 dark:bg-gray-800">
        <div className="sticky top-0 z-10 flex h-16 w-full shrink-0 items-center justify-between bg-gray-200 p-4 shadow dark:bg-gray-700">
          <NamespaceSelect />

          <button onClick={() => setShowContextSwitcher(true)}>
            <Context />
          </button>

          <Cog8ToothIcon
            className="h-6 w-6 cursor-pointer fill-gray-600 hover:fill-gray-800 dark:fill-gray-400 dark:hover:fill-gray-200"
            onClick={() => setShowSetting(true)}
          />
          <Suspense fallback={<div>Loading Settings</div>}>
            <Settings isOpen={showSetting} handleClose={() => setShowSetting(false)} />
          </Suspense>

          <ContextSwitcher
            isOpen={showContextSwitcher}
            handleClose={() => setShowContextSwitcher(false)}
          />
        </div>

        <main className="flex-1">
          <div className="mx-auto max-w-7xl">
            <div className="p-4">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
