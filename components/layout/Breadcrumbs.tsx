"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useBreadcrumbContext } from "@/context/BreadcrumbContext";
import type { BreadcrumbItem } from "@/types/breadcrumb";

// Optional: custom titles for URL segments (fallback is Title Case)
const TITLES: Record<string, string> = {
    dashboard: "Dashboard",
    settings: "Settings",
};

function fromPathname(pathname: string): BreadcrumbItem[] {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, i) => ({
        title:
            TITLES[segment] ??
            segment.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        href: "/" + segments.slice(0, i + 1).join("/"),
    }));
}

export default function Breadcrumbs() {
    const pathname = usePathname();
    const { items } = useBreadcrumbContext();

    const crumbs = items ?? fromPathname(pathname);
    if (crumbs.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="min-w-0">
            <ol className="flex items-center gap-1.5 text-sm">
                {crumbs.map((crumb, i) => {
                    const isLast = i === crumbs.length - 1;
                    return (
                        <li key={`${crumb.title}-${i}`} className="flex min-w-0 items-center gap-1.5">
                            {i > 0 && (
                                <ChevronRight size={14} className="shrink-0 text-muted-foreground" />
                            )}
                            {isLast || !crumb.href ? (
                                <span
                                    aria-current={isLast ? "page" : undefined}
                                    className="truncate font-medium text-foreground"
                                >
                                    {crumb.title}
                                </span>
                            ) : (
                                <Link
                                    href={crumb.href}
                                    className="truncate text-muted-foreground hover:text-foreground"
                                >
                                    {crumb.title}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}