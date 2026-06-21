import type { ReactNode } from "react";
import { cn } from "@/shared/utils/utils";

type DashboardCardProps = {
    children: ReactNode;
    className?: string;
};

export function DashboardCard({ children, className }: DashboardCardProps) {
    return (
        <section
            className={cn(
                "rounded-3xl border border-border bg-card p-5 shadow-sm",
                className
            )}
        >
            {children}
        </section>
    );
}

export function DashboardSectionHeader({
    title,
    description,
    action,
}: {
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    {title}
                </h2>
                {description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                ) : null}
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
    );
}
