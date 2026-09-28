import type { LucideIcon } from "lucide-react";
import Card from "./Card";

export default function StatCard({
    label,
    value,
    hint,
    icon: Icon,
}: {
    label?: string;
    value?: string | number;
    hint?: string;
    icon?: LucideIcon;
}) {
    // Blank placeholder when no data is provided
    if (!label && value === undefined) {
        return (
            <Card className="flex h-28 items-center justify-center border-dashed text-sm text-muted-foreground">
                Stat card
            </Card>
        );
    }

    return (
        <Card className="flex items-start justify-between">
            <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-semibold">{value}</p>
                {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
            </div>
            {Icon && (
                <span className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Icon size={20} />
                </span>
            )}
        </Card>
    );
}