import { type Context, type KubeConfig } from "@kubernetes/client-node";
import { createContext, type PropsWithChildren, useContext, useState, useEffect } from "react";

import { useResource } from "../hooks/use-resource";

type CurrentContext = string | null;

const CurrentContextContext = createContext<{
  currentContext: CurrentContext;
  changeCurrentContext: (context: CurrentContext) => void;
  availableContexts: Context[];
}>({
  currentContext: null,
  changeCurrentContext: () => {
    throw new Error("Make sure to wrap the app with LanguageProvider");
  },
  availableContexts: [],
});

export const useCurrentContext = () => useContext(CurrentContextContext);

const contextKey = "current-context";

export function CurrentContextProvider({ children }: PropsWithChildren) {
  const { data, isSuccess } = useResource<KubeConfig>("get_config");

  const availableContexts = data?.contexts ?? [];

  const storedCurrentContext = localStorage.getItem(contextKey);

  const [currentContext, setCurrentContext] = useState<CurrentContext>(
    // @ts-expect-error: result is current-context instead of currentContext
    storedCurrentContext || data?.[contextKey]
  );

  useEffect(() => {
    if (!currentContext && isSuccess) {
      // @ts-expect-error: result is current-context instead of currentContext
      setCurrentContext(data[contextKey]);
    }
  }, [isSuccess]);

  const changeCurrentContext = (context: CurrentContext) => {
    if (context) {
      localStorage.setItem(contextKey, context);
    }
    setCurrentContext(context);
  };

  return (
    <CurrentContextContext.Provider
      value={{ currentContext, changeCurrentContext, availableContexts }}
    >
      {children}
    </CurrentContextContext.Provider>
  );
}
