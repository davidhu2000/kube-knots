import { type PropsWithChildren } from "react";

import { NamespaceProvider, CurrentNamespaceProvider } from "./namespaces/namespaces";
import { LanguageProvider } from "./providers/language-provider";
import { ThemeProvider } from "./providers/theme-provider";

type Provider = ({ children }: PropsWithChildren) => JSX.Element;

const providers = [NamespaceProvider, CurrentNamespaceProvider, ThemeProvider, LanguageProvider];

const composeProviders = (providers: Provider[]) => {
  // eslint-disable-next-line react/display-name
  return providers.reduce((Prev, Curr) => ({ children }: PropsWithChildren) => (
    <Prev>
      <Curr>{children}</Curr>
    </Prev>
  ));
};

export const AppProviders = composeProviders(providers);
