"use client";

import { createContext, useContext, useState } from "react";
import type { BreadcrumbItem } from "@/types/breadcrumb";

type BreadcrumbContextType = {
    items: BreadcrumbItem[] | null;
    setItems: (items: BreadcrumbItem[] | null) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType>(null!);
export const useBreadcrumbContext = () => useContext(BreadcrumbContext);

export function BreadcrumbProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<BreadcrumbItem[] | null>(null);

    return (
        <BreadcrumbContext.Provider value={{ items, setItems }}>
            {children}
        </BreadcrumbContext.Provider>
    );
}