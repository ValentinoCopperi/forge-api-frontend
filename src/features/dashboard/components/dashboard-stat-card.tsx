import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { DashboardCard } from "./dashboard-card";

export type StatAccent = "primary" | "blue" | "emerald" | "amber" | "rose";

const ACCENT_STYLES: Record<
    StatAccent,
    { orb: string; icon: string; value: string; footer: string }
> = {
    primary: {
        orb: "bg-primary/15",
        icon: "bg-primary/15 text-primary ring-primary/20",
        value: "text-foreground",
        footer: "text-primary",
    },
    blue: {
        orb: "bg-chart-2/20",
        icon: "bg-chart-2/15 text-chart-2 ring-chart-2/25",
        value: "text-chart-2",
        footer: "text-chart-2",
    },
    emerald: {
        orb: "bg-chart-3/20",
        icon: "bg-chart-3/15 text-chart-3 ring-chart-3/25",
        value: "text-chart-3",
        footer: "text-chart-3",
    },
    amber: {
        orb: "bg-chart-4/25",
        icon: "bg-chart-4/15 text-chart-4 ring-chart-4/25",
        value: "text-chart-4",
        footer: "text-chart-4",
    },
    rose: {
        orb: "bg-chart-5/20",
        icon: "bg-chart-5/15 text-chart-5 ring-chart-5/25",
        value: "text-chart-5",
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
        <DashboardCard hover className="relative overflow-hidden">
            <div
                className={cn(
                    "absolute -top-12 -right-12 size-36 rounded-full blur-2xl",
                    styles.orb
                )}
            />
            <div className="relative flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        {label}
                    </p>
                    <p
                        className={cn(
                            "mt-3 text-4xl font-bold tracking-tight",
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
                        "flex size-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset",
                        styles.icon
                    )}
                >
                    <Icon className="size-5" />
                </span>
            </div>
            <div
                className={cn(
                    "relative mt-5 flex items-center gap-1.5 text-xs font-semibold",
                    styles.footer
                )}
            >
                <span className="size-1.5 rounded-full bg-current" />
                Live from API
            </div>
        </DashboardCard>
    );
}
