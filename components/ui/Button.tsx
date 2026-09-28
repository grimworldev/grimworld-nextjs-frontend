import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "danger";

type ButtonProps = ComponentProps<"button"> & {
    variant?: Variant;
    loading?: boolean;
};

export default function Button({
    variant = "primary",
    loading = false,
    disabled,
    className,
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={disabled || loading}
            className={cn(`btn-${variant}`, className)}
            {...props}
        >
            {children}
        </button>
    );
}