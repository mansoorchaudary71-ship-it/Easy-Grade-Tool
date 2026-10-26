import React, { createContext, useContext, useEffect } from 'react';

/**
 * The site is light-mode only. This provider is kept so existing consumers of
 * `useTheme` keep compiling, but there is nothing to switch: the theme is
 * always "light", and any leftover `.dark` class or stored preference from an
 * earlier version of the site is cleared on mount.
 */
type ThemeMode = 'light';

interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: 'light';
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const LEGACY_STORAGE_KEY = 'easy_grade_theme_preference';

const noop = () => undefined;
const VALUE: ThemeContextValue = {
  theme: 'light',
  resolvedTheme: 'light',
  setTheme: noop,
  toggleTheme: noop,
};

const ThemeContext = createContext<ThemeContextValue>(VALUE);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    try {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // storage blocked: nothing to clean up
    }
  }, []);

  return <ThemeContext.Provider value={VALUE}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => useContext(ThemeContext);
