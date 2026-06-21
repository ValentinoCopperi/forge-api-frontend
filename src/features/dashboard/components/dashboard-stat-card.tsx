import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { DashboardCard } from "./dashboard-card";

type DashboardStatCardProps = {
    label: string;
    value: string;
    helper: string;
    icon: LucideIcon;
};

export function DashboardStatCard({
    label,
    value,
    helper,
    icon: Icon,
}: DashboardStatCardProps) {
    return (
        <DashboardCard className="relative overflow-hidden">
            <div className="absolute -top-10 -right-10 size-28 rounded-full bg-primary/10" />
            <div className="relative flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                        {value}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{helper}</p>
                </div>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                </span>
            </div>
            <div className="relative mt-5 flex items-center gap-1 text-xs font-medium text-primary">
                <ArrowUpRight className="size-3.5" />
                Data synced with the API
            </div>
        </DashboardCard>
    );
}
