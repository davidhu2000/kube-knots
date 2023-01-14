import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

import { Layout } from "./layout";
import { CurrentNamespaceProvider, NamespaceProvider } from "./namespaces/namespaces";
import { Pods } from "./pods/pods";

const queryClient = new QueryClient();

type Provider = ({ children }: PropsWithChildren) => JSX.Element;

const providers = [NamespaceProvider, CurrentNamespaceProvider];

const composeProviders = (providers: Provider[]) => {
  // eslint-disable-next-line react/display-name
  return providers.reduce((Prev, Curr) => ({ children }: PropsWithChildren) => (
    <Prev>
      <Curr>{children}</Curr>
    </Prev>
  ));
};

const AppProviders = composeProviders(providers);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <Layout>
          <Pods />
        </Layout>
      </AppProviders>
    </QueryClientProvider>
  );
}
