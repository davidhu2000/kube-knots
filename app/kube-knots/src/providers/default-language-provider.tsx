import { createContext, type PropsWithChildren, useContext, useState } from "react";

type Language = "json" | "yaml";
const languages: Language[] = ["json", "yaml"];

const DefaultLanguageContext = createContext<{
  language: Language;
  languages: Language[];
  changeLanguage: (theme: Language) => void;
}>({
  language: "yaml",
  languages,
  changeLanguage: () => {
    throw new Error("Make sure to wrap the app with LanguageProvider");
  },
});

export const useDefaultLanguage = () => useContext(DefaultLanguageContext);

const languageKey = "preferred-language";

export function DefaultLanguageProvider({ children }: PropsWithChildren) {
  const preferredLanguage = (localStorage.getItem(languageKey) || "yaml") as Language;

  const [language, setLanguage] = useState<Language>(preferredLanguage);

  const changeLanguage = (language: Language) => {
    localStorage.setItem(languageKey, language);
    setLanguage(language);
  };

  return (
    <DefaultLanguageContext.Provider value={{ language, changeLanguage, languages }}>
      {children}
    </DefaultLanguageContext.Provider>
  );
}
