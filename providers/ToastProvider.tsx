"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";

type ToastType = "success" | "error" | "info";

type Toast = {
    id: number;
    message: string;
    type: ToastType;
};

type ToastContextType = {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

const styles: Record<ToastType, string> = {
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    info: "bg-slate-800 text-white",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const remove = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const add = useCallback(
        (message: string, type: ToastType) => {
            const id = Date.now() + Math.random();
            setToasts((prev) => [...prev, { id, message, type }]);
            setTimeout(() => remove(id), 4000); // auto-dismiss after 4s
        },
        [remove]
    );

    const value = useMemo<ToastContextType>(
        () => ({
            success: (m) => add(m, "success"),
            error: (m) => add(m, "error"),
            info: (m) => add(m, "info"),
        }),
        [add]
    );

    return (
        <ToastContext.Provider value={value}>
            {children}

            {/* Toast container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center justify-between gap-4 rounded-md px-4 py-3 shadow-lg ${styles[toast.type]}`}
                    >
                        <span>{toast.message}</span>
                        <button
                            onClick={() => remove(toast.id)}
                            className="opacity-70 hover:opacity-100"
                            aria-label="Close"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used inside <ToastProvider>");
    }
    return context;
}