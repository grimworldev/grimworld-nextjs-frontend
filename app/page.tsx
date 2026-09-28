"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layers, ShieldCheck, Rocket, Server } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const features = [
  {
    icon: Server,
    title: "Laravel REST API",
    text: "A clean backend with UUID users, validation, and versionable routes.",
  },
  {
    icon: ShieldCheck,
    title: "Token authentication",
    text: "Register, login, and logout with Laravel Sanctum, wired to the frontend.",
  },
  {
    icon: Layers,
    title: "Authenticated layout",
    text: "Sidebar and topbar with a route-group guard. Drop a page in and it's protected.",
  },
  {
    icon: Rocket,
    title: "Ready to extend",
    text: "Next.js App Router, TypeScript, and Tailwind. Build anything on top.",
  },
];

export default function Home() {
  const { user, loading } = useAuth();
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    api
      .get("/hello")
      .then(() => setApiStatus("online"))
      .catch(() => setApiStatus("offline"));
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="text-lg font-bold tracking-wide">GRIMWORLD</span>

          <nav className="flex items-center gap-2">
            {loading ? null : user ? (
              <Link href="/dashboard" className="btn-primary">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted">
                  Login
                </Link>
                <Link href="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
            <span
              className={`h-2 w-2 rounded-full ${apiStatus === "online"
                  ? "bg-success"
                  : apiStatus === "offline"
                    ? "bg-danger"
                    : "bg-warning"
                }`}
            />
            API {apiStatus}
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            GRIMWORLD <span className="text-primary">Starter Kit</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            A Laravel + Next.js starter kit powered by a REST API. Authentication,
            an authenticated layout, and a clean structure, so you can skip the
            setup and start building.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href={user ? "/dashboard" : "/register"} className="btn-primary px-6 py-3">
              {user ? "Go to dashboard" : "Get started"}
            </Link>
            {!user && (
              <Link href="/login" className="btn-secondary px-6 py-3">
                Login
              </Link>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-5">
                <Icon className="text-primary" size={22} />
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        GRIMWORLD Starter Kit · Developed by FJ Buenaflor
      </footer>
    </div>
  );
}