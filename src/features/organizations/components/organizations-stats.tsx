import { useEffect, useState } from "react";
import type { OrganizationsGetAllByUserResponseDto } from "@/shared/api/generated";
import { formatCompactNumber } from "@/features/dashboard/utils/dashboard.utils";
import { DashboardCard, DashboardStatCard } from "@/features/dashboard";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { cn } from "@/shared/utils/utils";
import { Building2, FolderKanban, RefreshCw, UsersRound } from "lucide-react";
import type { OrganizationListTab } from "../types/organization-table.types";
import type { OrganizationFilters, OrganizationFilterUser } from "../types/organization-filters.types";
import {
    OrganizationsFiltersPanel,
    OrganizationsFiltersToggle,
} from "./organizations-filters-panel";
import { countActiveOrganizationFilters } from "../utils/organization-filters.utils";
import { OrganizationsTableTabs } from "./organizations-table-tabs";

type OrganizationsStatsProps = {
    organizations: OrganizationsGetAllByUserResponseDto[];
    isRefreshing?: boolean;
};

export function OrganizationsStats({
    organizations,
    isRefreshing,
}: OrganizationsStatsProps) {
    const totalMembers = organizations.reduce(
        (sum, org) => sum + org._count.OrganizationUser,
        0
    );
    const totalProjects = organizations.reduce(
        (sum, org) => sum + org._count.Project,
        0
    );

    return (
        <section
            className={cn(
                "grid gap-5 transition-opacity md:grid-cols-3",
                isRefreshing && "opacity-60"
            )}
        >
            <DashboardStatCard
                accent="primary"
                icon={Building2}
                label="Organizations"
                value={formatCompactNumber(organizations.length)}
                helper="Workspaces you belong to"
            />
            <DashboardStatCard
                accent="blue"
                icon={UsersRound}
                label="Members"
                value={formatCompactNumber(totalMembers)}
                helper="Total across your workspaces"
            />
            <DashboardStatCard
                accent="emerald"
                icon={FolderKanban}
                label="Projects"
                value={formatCompactNumber(totalProjects)}
                helper="Total across your workspaces"
            />
        </section>
    );
}

const TAB_COPY: Record<
    OrganizationListTab,
    { title: string; subtitle: string }
> = {
    mine: {
        title: "Your organizations",
        subtitle: "linked to your account",
    },
    all: {
        title: "All organizations",
        subtitle: "registered in the platform",
    },
};

export function OrganizationsTableCard({
    children,
    activeTab,
    onTabChange,
    mineCount,
    allCount,
    isRefreshing,
    onRefresh,
    allTabError,
    onRetryAll,
    filters,
    onFiltersChange,
    onFiltersReset,
    filteredCount,
    totalCount,
    creators,
}: {
    children: React.ReactNode;
    activeTab: OrganizationListTab;
    onTabChange: (tab: OrganizationListTab) => void;
    mineCount: number;
    allCount: number;
    isRefreshing?: boolean;
    onRefresh?: () => void;
    allTabError?: boolean;
    onRetryAll?: () => void;
    filters: OrganizationFilters;
    onFiltersChange: (filters: OrganizationFilters) => void;
    onFiltersReset: () => void;
    filteredCount: number;
    totalCount: number;
    creators: OrganizationFilterUser[];
}) {
    const [filtersOpen, setFiltersOpen] = useState(false);
    const copy = TAB_COPY[activeTab];
    const count = activeTab === "mine" ? mineCount : allCount;
    const activeFilterCount = countActiveOrganizationFilters(filters);

    useEffect(() => {
        setFiltersOpen(false);
    }, [activeTab]);

    return (
        <DashboardCard className="overflow-hidden p-0">
            <div className="space-y-4 border-b border-border px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                        <h2 className="text-lg font-bold tracking-tight text-foreground">
                            {copy.title}
                        </h2>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            <span className="font-semibold text-primary">
                                {count}
                            </span>{" "}
                            workspace{count === 1 ? "" : "s"} {copy.subtitle}
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <OrganizationsFiltersToggle
                            open={filtersOpen}
                            activeCount={activeFilterCount}
                            onToggle={() => setFiltersOpen((prev) => !prev)}
                        />

                        {onRefresh ? (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isRefreshing}
                                onClick={onRefresh}
                            >
                                {isRefreshing ? (
                                    <Spinner className="size-4" />
                                ) : (
                                    <RefreshCw className="size-4" />
                                )}
                                Refresh
                            </Button>
                        ) : null}
                    </div>
                </div>

                <OrganizationsTableTabs
                    value={activeTab}
                    onChange={onTabChange}
                    mineCount={mineCount}
                    allCount={allCount}
                />
            </div>

            <OrganizationsFiltersPanel
                open={filtersOpen}
                filters={filters}
                creators={creators}
                onChange={onFiltersChange}
                onReset={onFiltersReset}
                resultCount={filteredCount}
                totalCount={totalCount}
            />

            {allTabError && activeTab === "all" ? (
                <div className="border-b border-destructive/20 bg-destructive/5 px-5 py-3 sm:px-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm text-destructive">
                            Could not load all organizations. You may not have
                            permission to access this list.
                        </p>
                        {onRetryAll ? (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={onRetryAll}
                            >
                                Retry
                            </Button>
                        ) : null}
                    </div>
                </div>
            ) : null}

            {children}
        </DashboardCard>
    );
}
