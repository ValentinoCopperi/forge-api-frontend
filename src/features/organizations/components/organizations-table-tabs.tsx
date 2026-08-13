import { Building2, Globe2 } from "lucide-react";
import type { OrganizationListTab } from "../types/organization-table.types";
import { cn } from "@/shared/utils/utils";

type OrganizationsTableTabsProps = {
    value: OrganizationListTab;
    onChange: (tab: OrganizationListTab) => void;
    mineCount: number;
    allCount: number;
    className?: string;
};

const TABS: {
    id: OrganizationListTab;
    label: string;
    icon: typeof Building2;
}[] = [
    { id: "mine", label: "My organizations", icon: Building2 },
    { id: "all", label: "All organizations", icon: Globe2 },
];

export function OrganizationsTableTabs({
    value,
    onChange,
    mineCount,
    allCount,
    className,
}: OrganizationsTableTabsProps) {
    const counts: Record<OrganizationListTab, number> = {
        mine: mineCount,
        all: allCount,
    };

    return (
        <div
            className={cn(
                "inline-flex rounded-xl border border-border bg-muted/40 p-1",
                className
            )}
            role="tablist"
            aria-label="Organization list view"
        >
            {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = value === tab.id;

                return (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors",
                            isActive
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                        )}
                    >
                        <Icon className="size-4" />
                        {tab.label}
                        <span
                            className={cn(
                                "rounded-full px-2 py-0.5 text-[11px] font-bold",
                                isActive
                                    ? "bg-primary/12 text-primary"
                                    : "bg-muted text-muted-foreground"
                            )}
                        >
                            {counts[tab.id]}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
