"use client";

import { useEffect } from "react";
import { useBreadcrumbContext } from "@/context/BreadcrumbContext";
import type { BreadcrumbItem } from "@/types/breadcrumb";

export default function AppPage({
    breadcrumbs,
    children,
}: {
    breadcrumbs: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    const { setItems } = useBreadcrumbContext();

    // Serialize so an inline array doesn't retrigger the effect on every render
    const key = JSON.stringify(breadcrumbs);

    useEffect(() => {
        setItems(JSON.parse(key));
        return () => setItems(null); // clear when leaving the page
    }, [key, setItems]);

    return <>{children}</>;
}