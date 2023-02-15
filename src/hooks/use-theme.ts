export function useTheme() {
  const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");

  return {
    theme: darkThemeMq.matches ? "dark" : "light",
  } as const;
}
