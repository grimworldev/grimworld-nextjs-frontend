import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export default function Label({ className, ...props }: ComponentProps<"label">) {
    return <label className={cn("label", className)} {...props} />;
}