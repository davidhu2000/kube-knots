import { createContext, type PropsWithChildren, useContext, useState, useEffect } from "react";

type SystemThemes = "dark" | "light";
type Themes = SystemThemes | "system";
const themes: Themes[] = ["dark", "light", "system"];
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

interface ThemeContext {
  theme: Themes;
  themes: Themes[];
  changeTheme: (theme: Themes) => void;
  systemTheme: SystemThemes;
}

const ThemeContext = createContext<ThemeContext>({
  theme: systemTheme,
  systemTheme,
  themes,
  changeTheme: () => {
    throw new Error("Make sure to wrap the app with ThemeProvider");
  },
});

export const useTheme = () => useContext(ThemeContext);

const colorThemeKey = "color-theme";

export function ThemeProvider({ children }: PropsWithChildren) {
  const isCurrentThemeDark =
    localStorage.getItem(colorThemeKey) === "dark" ||
    (!(colorThemeKey in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const [theme, setTheme] = useState<Themes>(isCurrentThemeDark ? "dark" : "light");

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (theme === "light") {
    document.documentElement.classList.remove("dark");
  }

  const changeTheme = (theme: Themes) => {
    if (theme !== "system") {
      localStorage.setItem(colorThemeKey, theme);
      setTheme(theme);
      return;
    }

    localStorage.removeItem(colorThemeKey);
    setTheme("system");
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      if (localStorage.getItem(colorThemeKey)) {
        localStorage.setItem(colorThemeKey, "dark");
      }
    } else if (theme === "light") {
      if (localStorage.getItem(colorThemeKey)) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem(colorThemeKey, "light");
      }
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, themes, systemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
