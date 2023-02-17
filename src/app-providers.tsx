import { type PropsWithChildren } from "react";

import { NamespaceProvider, CurrentNamespaceProvider } from "./namespaces/namespaces";
import { DefaultLanguageProvider } from "./providers/default-language-provider";
import { ThemeProvider } from "./providers/theme-provider";

type Provider = ({ children }: PropsWithChildren) => JSX.Element;

const providers = [
  NamespaceProvider,
  CurrentNamespaceProvider,
  ThemeProvider,
  DefaultLanguageProvider,
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
