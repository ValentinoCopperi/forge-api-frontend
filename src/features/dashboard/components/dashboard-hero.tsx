import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/shared/utils/utils";

type DashboardHeroProps = {
    badge: { icon: LucideIcon; label: string };
    title: ReactNode;
    description: string;
    meta?: ReactNode;
    action?: ReactNode;
    className?: string;
};

export function DashboardHero({
    badge,
    title,
    description,
    meta,
    action,
    className,
}: DashboardHeroProps) {
    const BadgeIcon = badge.icon;

    return (
        <header className={cn("dashboard-hero-surface p-6 sm:p-8", className)}>
            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/12 via-chart-2/6 to-chart-3/8" />
            <div className="pointer-events-none absolute -top-20 -right-16 size-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 size-56 rounded-full bg-chart-2/15 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/12 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-primary uppercase shadow-sm shadow-primary/10">
                        <BadgeIcon className="size-3.5" />
                        {badge.label}
                    </div>

                    <h1 className="mt-5 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        {title}
                    </h1>

                    <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                        {description}
                    </p>

                    {meta ? <div className="mt-5">{meta}</div> : null}
                </div>

                {action ? <div className="relative shrink-0">{action}</div> : null}
            </div>
        </header>
    );
}
