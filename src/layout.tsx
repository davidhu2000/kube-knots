import { DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link } from "@tanstack/react-router";
import type { PropsWithChildren } from "react";

import { NamespaceSelect } from "./namespaces/namespace-select";
import { serviceRoutes, todoRoutes, workloadsRoutes } from "./router";

const sections = [
  { title: "Workload", routes: workloadsRoutes },
  { title: "Service", routes: serviceRoutes },
  { title: "TODO", routes: todoRoutes },
];

export function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <div className="fixed inset-y-0 flex w-40 flex-col bg-gray-200">
        <div className="flex h-16 items-center px-2 font-medium">
          {/* TODO: update logo */}
          <DocumentMagnifyingGlassIcon className="mr-2 h-6 w-6" aria-hidden="true" />
          Kube Knots
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-2 py-4">
            {sections.map(({ title, routes }) => (
              <>
                <h1 className="font-bold">{title}</h1>
                {routes.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="group flex items-center rounded-md p-2 text-sm font-medium text-gray-800 hover:bg-gray-400"
                    search={{}}
                    params={{}}
                  >
                    {item.name}
                  </Link>
                ))}
              </>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex flex-col pl-40">
        <div className="sticky top-0 z-10 flex h-16 shrink-0 bg-gray-200 p-2 shadow">
          <NamespaceSelect />
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4">
              <div className="py-4">{children}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
