import { Pods } from "./pods/pods";
import { Namespaces } from "./namespaces/namespaces";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container">
        <h1>Kube Knots</h1>

        <h2>Pods</h2>
        <Pods />
      </div>
    </QueryClientProvider>
  );
}
