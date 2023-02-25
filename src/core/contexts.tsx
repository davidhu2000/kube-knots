import { useCurrentContext } from "../providers/current-context-provider";

export function Contexts() {
  const { currentContext } = useCurrentContext();
  return (
    <div className="flex">
      <div>Current Context: {currentContext}</div>
    </div>
  );
}
