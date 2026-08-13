import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { DashboardCard } from "./dashboard-card";

export type StatAccent = "primary" | "blue" | "emerald" | "amber" | "rose";

const ACCENT_STYLES: Record<
    StatAccent,
    { icon: string; value: string; footer: string }
> = {
    primary: {
        icon: "bg-primary/10 text-primary ring-primary/15",
        value: "text-foreground",
        footer: "text-primary",
    },
    blue: {
        icon: "bg-chart-2/10 text-chart-2 ring-chart-2/15",
        value: "text-foreground",
        footer: "text-chart-2",
    },
    emerald: {
        icon: "bg-chart-3/10 text-chart-3 ring-chart-3/15",
        value: "text-foreground",
        footer: "text-chart-3",
    },
    amber: {
        icon: "bg-chart-4/10 text-chart-4 ring-chart-4/15",
        value: "text-foreground",
        footer: "text-chart-4",
    },
    rose: {
        icon: "bg-chart-5/10 text-chart-5 ring-chart-5/15",
        value: "text-foreground",
        footer: "text-chart-5",
    },
};

type DashboardStatCardProps = {
    label: string;
    value: string;
    helper: string;
    icon: LucideIcon;
    accent?: StatAccent;
};

export function DashboardStatCard({
    label,
    value,
    helper,
    icon: Icon,
    accent = "primary",
}: DashboardStatCardProps) {
    const styles = ACCENT_STYLES[accent];

    return (
        <DashboardCard>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        {label}
                    </p>
                    <p
                        className={cn(
                            "mt-3 text-3xl font-bold tracking-tight",
                            styles.value
                        )}
                    >
                        {value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {helper}
                    </p>
                </div>
                <span
                    className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
                        styles.icon
                    )}
                >
                    <Icon className="size-4.5" />
                </span>
            </div>
            <div
                className={cn(
                    "mt-5 flex items-center gap-1.5 border-t border-border pt-3 text-xs font-medium",
                    styles.footer
                )}
            >
                <span className="size-1.5 rounded-full bg-current" />
                Live from API
            </div>
        </DashboardCard>
    );
}
