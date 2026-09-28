"use client";

import { useState } from "react";
import {
    MutationCache,
    QueryCache,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import type { ApiError } from "@/lib/api";
import { useToast } from "@/providers/ToastProvider";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const toast = useToast();

    const [client] = useState(() => {
        const handleError = (error: unknown) => {
            const err = error as ApiError;

            if (err.status === 422 && err.errors) {
                Object.values(err.errors).forEach((messages) => toast.error(messages[0]));
                return;
            }

            toast.error(err.message ?? "Something went wrong.");
        };

        return new QueryClient({
            queryCache: new QueryCache({ onError: handleError }),
            mutationCache: new MutationCache({ onError: handleError }),
            defaultOptions: {
                queries: {
                    staleTime: 60_000,
                    refetchOnWindowFocus: false,
                    retry: (failureCount, error) => {
                        const status = (error as ApiError).status;
                        if (status && status >= 400 && status < 500) return false;
                        return failureCount < 1;
                    },
                },
            },
        });
    });

    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}