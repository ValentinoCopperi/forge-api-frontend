import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/utils/utils";

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
        <article className="min-w-0 bg-card">
            <div className="flex min-h-28 items-stretch">
                <span
                    className={cn(
                        "flex w-12 shrink-0 items-center justify-center border-r border-border",
                        styles.icon
                    )}
                >
                    <Icon className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1 px-4 py-3.5">
                    <p className="text-[10px] font-bold tracking-[0.1em] text-muted-foreground uppercase">
                        {label}
                    </p>
                    <p
                        className={cn(
                            "mt-1 text-2xl font-extrabold tracking-[-0.03em] tabular-nums",
                            styles.value
                        )}
                    >
                        {value}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                        {helper}
                    </p>
                </div>
            </div>
            <div
                className={cn(
                    "flex items-center gap-1.5 border-t border-border px-4 py-2 text-[10px] font-bold tracking-wide uppercase",
                    styles.footer
                )}
            >
                <span className="size-1.5 rounded-full bg-current" />
                API live
            </div>
        </article>
    );
}
