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
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                    <div className="eyebrow">
                        <BadgeIcon className="size-3.5" />
                        {badge.label}
                    </div>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        {title}
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                        {description}
                    </p>

                    {meta ? <div className="mt-5">{meta}</div> : null}
                </div>

                {action ? <div className="shrink-0">{action}</div> : null}
            </div>
        </header>
    );
}
