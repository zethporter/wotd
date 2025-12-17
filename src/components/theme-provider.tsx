import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system", // Default for initial server render
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  // 1. Initialize state with the defaultTheme (safe for SSR).
  //    The actual theme from localStorage will be loaded in useEffect.
  const [theme, setThemeState] = useState<Theme>(defaultTheme);

  // 2. useEffect to load theme from localStorage on client-side mount
  useEffect(() => {
    // This code only runs in the browser
    const storedTheme = localStorage.getItem(storageKey) as Theme;
    if (storedTheme) {
      setThemeState(storedTheme);
    } else {
      // If no stored theme, set to defaultTheme (already done, but good to be explicit)
      setThemeState(defaultTheme);
    }
  }, [defaultTheme, storageKey]); // Depend on defaultTheme and storageKey

  // 3. useEffect to apply the theme class to the documentElement
  useEffect(() => {
    // Ensure this only runs in a browser environment as well,
    // although `useState` update will only happen after localStorage load.
    if (typeof window === "undefined") {
      return; // Skip if on server
    }

    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // 4. Custom setTheme function to update localStorage and state
  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Ensure localStorage is only accessed on client
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, newTheme);
      }
      setThemeState(newTheme); // Update React state
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
