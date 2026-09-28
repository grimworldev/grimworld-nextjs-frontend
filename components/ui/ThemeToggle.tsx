"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";

export default function ThemeToggle() {
    const { setTheme } = useTheme();

    function toggle() {
        const isDark = document.documentElement.classList.contains("dark");
        setTheme(isDark ? "light" : "dark");
    }

    return (
        <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted"
        >
            <Moon size={18} className="dark:hidden" />
            <Sun size={18} className="hidden dark:block" />
        </button>
    );
}