"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, X } from "lucide-react";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];

export default function Sidebar({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const pathname = usePathname();

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-surface transition-transform duration-200 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-16 items-center justify-between border-b border-border px-4">
                    <Link href="/dashboard" className="text-lg font-semibold">
                        GRIMWORLD
                    </Link>
                    <button
                        onClick={onClose}
                        className="rounded p-1 text-muted-foreground hover:bg-muted lg:hidden"
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="space-y-1 p-3">
                    {navItems.map(({ label, href, icon: Icon }) => {
                        const active = pathname === href || pathname.startsWith(href + "/");
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={onClose}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon size={18} />
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}