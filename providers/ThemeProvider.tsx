"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

type ThemeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType>(null!);
export const useTheme = () => useContext(ThemeContext);

function applyTheme(theme: Theme) {
    const isDark =
        theme === "dark" ||
        (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("system");
    const [ready, setReady] = useState(false);

    // Load the saved choice once on the client
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === "light" || saved === "dark" || saved === "system") {
                setThemeState(saved);
            }
        } catch { }
        setReady(true);
    }, []);

    // Apply the theme, and follow the OS while "system" is selected
    useEffect(() => {
        if (!ready) return;
        applyTheme(theme);
        if (theme !== "system") return;

        const mq = matchMedia("(prefers-color-scheme: dark)");
        const onChange = () => applyTheme("system");
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, [theme, ready]);

    function setTheme(next: Theme) {
        setThemeState(next);
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch { }
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}