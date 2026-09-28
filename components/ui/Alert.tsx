import type { ReactNode } from "react";

export default function Alert({ children }: { children?: ReactNode }) {
    if (!children) return null;
    return <p className="alert-danger">{children}</p>;
}