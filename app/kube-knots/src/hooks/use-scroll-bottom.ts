import { useRef, useEffect, type DependencyList } from "react";

export function useScrollBottom(deps: DependencyList) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, deps);

  return bottomRef;
}
