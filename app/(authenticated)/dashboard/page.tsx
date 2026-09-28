"use client";

import AppPage from "@/components/layout/AppLayout";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import { useAuth } from "@/context/AuthContext";
import type { BreadcrumbItem } from "@/types/breadcrumb";

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Dashboard", href: "/dashboard" },
];

export default function DashboardPage() {
    const { user } = useAuth();

    return (
        <AppPage breadcrumbs={breadcrumbs}>
            <div className="space-y-6">
                {/* Welcome */}
                <div>
                    <h1 className="text-2xl font-semibold">
                        Welcome, {user?.first_name} {user?.last_name}!
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Here&apos;s what&apos;s happening with your account.
                    </p>
                </div>

                {/* Stat cards: 1 col on mobile, 2 on tablet, 4 on desktop.
            Fill in with <StatCard label="..." value="..." icon={...} /> */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard />
                    <StatCard />
                    <StatCard />
                    <StatCard />
                </div>

                {/* Two-column area: wide main card + narrow account card */}
                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <h2 className="font-semibold">Recent activity</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Your activity will show up here.
                        </p>
                        <div className="mt-4 flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                            Chart or table goes here
                        </div>
                    </Card>

                    <Card>
                        <h2 className="font-semibold">Your account</h2>
                        <dl className="mt-3 space-y-2 text-sm">
                            <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">Username</dt>
                                <dd>@{user?.username}</dd>
                            </div>
                            <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">First name</dt>
                                <dd>{user?.first_name}</dd>
                            </div>
                            <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">Last name</dt>
                                <dd>{user?.last_name}</dd>
                            </div>
                            <div className="flex justify-between gap-2">
                                <dt className="text-muted-foreground">Email</dt>
                                <dd className="truncate">{user?.email}</dd>
                            </div>
                        </dl>
                    </Card>
                </div>
            </div>
        </AppPage>
    );
}