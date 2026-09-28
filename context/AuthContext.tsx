"use client";

import { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { RegisterPayload, User } from "@/types/user";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (payload: RegisterPayload) => Promise<void>;
    logout: () => Promise<void>;
};

const AUTH_KEY = ["auth", "user"];

const AuthContext = createContext<AuthContextType>(null!);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const qc = useQueryClient();

    const { data: user = null, isLoading } = useQuery<User | null>({
        queryKey: AUTH_KEY,
        queryFn: async () => {
            if (!localStorage.getItem("token")) return null;
            try {
                const { data } = await api.get<User>("/user");
                return data;
            } catch {
                localStorage.removeItem("token");
                return null;
            }
        },
        staleTime: Infinity,
        retry: false,
    });

    async function login(username: string, password: string) {
        const { data } = await api.post("/login", { username, password });
        localStorage.setItem("token", data.token);
        qc.setQueryData(AUTH_KEY, data.user);
        router.push("/dashboard");
    }

    async function register(payload: RegisterPayload) {
        const { data } = await api.post("/register", payload);
        localStorage.setItem("token", data.token);
        qc.setQueryData(AUTH_KEY, data.user);
        router.push("/dashboard");
    }

    async function logout() {
        try {
            await api.post("/logout");
        } catch {
        } finally {
            localStorage.removeItem("token");
            qc.clear();
            router.push("/login");
        }
    }

    return (
        <AuthContext.Provider
            value={{ user, loading: isLoading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}