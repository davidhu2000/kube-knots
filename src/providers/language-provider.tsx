import { createContext, type PropsWithChildren, useContext, useState, useEffect } from "react";

type Language = "json" | "yaml";
const languages: Language[] = ["json", "yaml"];

const LanguageContext = createContext<{
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

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: PropsWithChildren) {
  const preferredLanguage = (localStorage.getItem("preferred-language") || "yaml") as Language;

  const [language, setLanguage] = useState<Language>(preferredLanguage);

  const changeLanguage = (language: Language) => {
    localStorage.setItem("preferred-language", language);
    setLanguage(language);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}
