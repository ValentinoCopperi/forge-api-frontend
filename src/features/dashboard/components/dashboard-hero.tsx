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
        <header className={cn("dashboard-hero-surface", className)}>
            <div className="flex flex-col gap-5 px-5 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-extrabold tracking-[-0.03em] text-foreground sm:text-[2rem]">
                            {title}
                        </h1>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-accent-foreground uppercase">
                            <BadgeIcon className="size-3.5" />
                            {badge.label}
                        </span>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                        {description}
                    </p>
                </div>
                {action ? <div className="shrink-0">{action}</div> : null}
            </div>
            {meta ? (
                <div className="border-t border-border bg-surface-subtle/55 px-5 py-3 sm:px-6">
                    {meta}
                </div>
            ) : null}
        </header>
    );
}
