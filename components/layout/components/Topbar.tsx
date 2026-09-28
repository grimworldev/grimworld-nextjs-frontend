"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, ChevronDown, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const initials =
        `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase();

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-2">
                <button
                    onClick={onMenuClick}
                    className="rounded p-2 text-muted-foreground hover:bg-muted lg:hidden"
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>
                <Breadcrumbs />
            </div>

            <div className="flex shrink-0 items-center gap-2">
                <ThemeToggle />

                <div className="relative" ref={ref}>
                    <button
                        onClick={() => setOpen(!open)}
                        className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted"
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                            {initials}
                        </span>
                        <span className="hidden text-sm font-medium sm:block">
                            {user?.first_name} {user?.last_name}
                        </span>
                        <ChevronDown size={16} className="text-muted-foreground" />
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-surface py-1 shadow-lg">
                            <div className="border-b border-border px-4 py-2">
                                <p className="text-sm font-medium">@{user?.username}</p>
                                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                            </div>

                            <Link
                                href="/settings"
                                onClick={() => setOpen(false)}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                            >
                                <Settings size={16} />
                                Settings
                            </Link>

                            <button
                                onClick={logout}
                                className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}