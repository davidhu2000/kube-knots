import { Cog8ToothIcon, PlusIcon } from "@heroicons/react/20/solid";
import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link } from "@tanstack/react-router";
import { lazy, Suspense, useState, type PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import { NamespaceSelect } from "./components/namespace-select";
import { Context, ContextSwitcher } from "./core/contexts";
import { useTheme } from "./providers/theme-provider";
import { clusterRoutes, configurationRoutes, networkingRoutes, workloadsRoutes } from "./router";

const Settings = lazy(() =>
  import("./settings/settings").then((module) => ({ default: module.Settings }))
);

const ResourceCreateDrawer = lazy(() =>
  import("./components/resource-create-drawer").then((module) => ({
    default: module.ResourceCreateDrawer,
  }))
);

export function Layout({ children }: PropsWithChildren) {
  const sections = [
    { title: "Workload", routes: workloadsRoutes },
    { title: "Networking", routes: networkingRoutes },
    { title: "Configurations", routes: configurationRoutes },
    { title: "Cluster", routes: clusterRoutes },
  ];

  const [showSetting, setShowSetting] = useState(false);
  const [showContextSwitcher, setShowContextSwitcher] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const { theme, systemTheme } = useTheme();
  const themeToUse = theme === "system" ? systemTheme : theme;

  return (
    <div className="min-h-screen">
      <div className="fixed inset-y-0 flex w-40 flex-col bg-gray-200 dark:bg-gray-700 dark:text-gray-100">
        <Link to="/" className="flex h-16 items-center px-4 font-medium">
          {/* TODO: update logo */}
          <DocumentMagnifyingGlassIcon className="mr-2 h-6 w-6" aria-hidden="true" />
          Kube Knots
        </Link>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-4">
            {sections.map(({ title, routes }) => (
              <span key={title}>
                <h1 className="mt-4 font-bold">{title}</h1>
                {routes.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center rounded-md p-2 text-sm font-medium text-gray-800 hover:bg-gray-400 dark:text-gray-100 hover:dark:bg-gray-500 ${
                      window.location.pathname === item.path ? "bg-gray-300 dark:bg-gray-600" : ""
                    }`}
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
          <div className="flex items-end gap-2">
            <NamespaceSelect />

            <button
              onClick={() => setShowCreate(true)}
              className="flex cursor-pointer items-center rounded-md bg-gray-300 p-2 hover:bg-gray-400 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <PlusIcon className="m-0 block h-6 w-6 fill-gray-600 hover:fill-gray-800 dark:fill-gray-400 dark:hover:fill-gray-200" />
              <span>Create</span>
            </button>
          </div>
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
          <Suspense fallback={<div>Loading Settings</div>}>
            <ResourceCreateDrawer isOpen={showCreate} handleClose={() => setShowCreate(false)} />
          </Suspense>
          <ContextSwitcher
            isOpen={showContextSwitcher}
            handleClose={() => setShowContextSwitcher(false)}
          />
        </div>

        <main className="flex-1 select-none">
          <div className="mx-auto max-w-7xl">
            <div className="p-4">{children}</div>
          </div>
        </main>
      </div>
      <ToastContainer
        theme={themeToUse}
        position="bottom-right"
        autoClose={5000}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
