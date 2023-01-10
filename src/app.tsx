import { Pods } from "./pods/pods";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container">
        <h1>Kube Knots</h1>

        <Pods />
      </div>
    </QueryClientProvider>
  );
}
