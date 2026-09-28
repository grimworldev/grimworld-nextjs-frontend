"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { BreadcrumbProvider } from "@/context/BreadcrumbContext";
import Sidebar from "@/components/layout/components/Sidebar";
import Topbar from "@/components/layout/components/Topbar";

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.replace("/login");
    }, [loading, user, router]);

    if (loading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center text-muted-foreground">
                Loading...
            </div>
        );
    }

    return (
        <BreadcrumbProvider>
            <div className="min-h-screen">
                <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                <div className="lg:pl-64">
                    <Topbar onMenuClick={() => setSidebarOpen(true)} />
                    <main className="p-4 sm:p-6">{children}</main>
                </div>
            </div>
        </BreadcrumbProvider>
    );
}