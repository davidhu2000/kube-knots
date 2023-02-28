import { type PropsWithChildren } from "react";

import { CurrentContextProvider } from "./providers/current-context-provider";
import { DefaultLanguageProvider } from "./providers/default-language-provider";
import { NamespaceProvider } from "./providers/namespaces-provider";
import { ThemeProvider } from "./providers/theme-provider";

type Provider = ({ children }: PropsWithChildren) => JSX.Element;

const providers = [
  NamespaceProvider,
  ThemeProvider,
  DefaultLanguageProvider,
  CurrentContextProvider,
];

const composeProviders = (providers: Provider[]) => {
  // eslint-disable-next-line react/display-name
  return providers.reduce((Prev, Curr) => ({ children }: PropsWithChildren) => (
    <Prev>
      <Curr>{children}</Curr>
    </Prev>
  ));
};

export const AppProviders = composeProviders(providers);
