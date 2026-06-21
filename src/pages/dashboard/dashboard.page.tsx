import { useState } from "react";
import { Activity, Building2, ChevronDown, FolderKanban, UsersRound } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
    DashboardCard,
    DashboardEmptyState,
    DashboardErrorState,
    DashboardInsights,
    DashboardLoadingState,
    DashboardOrganizationCard,
    DashboardSectionHeader,
    DashboardStatCard,
    formatCompactNumber,
    useDashboardData,
} from "@/features/dashboard";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";

const INITIAL_ORGANIZATIONS_LIMIT = 9;

export default function DashboardPage() {
    const [showAllOrganizations, setShowAllOrganizations] = useState(false);
    const user = useAuthStore((state) => state.user);
    const dashboard = useDashboardData();

    if (dashboard.isLoading) {
        return <DashboardLoadingState />;
    }

    if (dashboard.isError) {
        return <DashboardErrorState />;
    }

    if (dashboard.organizations.length === 0) {
        return <DashboardEmptyState />;
    }

    console.log("dashboard.organizations", dashboard.organizations);

    const hasMoreOrganizations =
        dashboard.organizations.length > INITIAL_ORGANIZATIONS_LIMIT;
    const visibleOrganizations = showAllOrganizations
        ? dashboard.organizations
        : dashboard.organizations.slice(0, INITIAL_ORGANIZATIONS_LIMIT);

    return (
        <div className="mx-auto flex w-full max-w-[85vw] flex-col gap-6">
            <header className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
                <div className="absolute inset-y-0 right-0 w-1/2 bg-linear-to-l from-primary/15 to-transparent" />
                <div className="absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            <Activity className="size-3.5" />
                            Executive summary
                            {dashboard.isRefreshing ? (
                                <Spinner className="size-3.5" />
                            ) : null}
                        </div>
                        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                            Hello{user?.name ? `, ${user.name}` : ""}. These are
                            your organizations.
                        </h1>
                        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                            A centralized view of organizations, members, projects,
                            owners, and roles using the endpoints defined by the
                            backend.
                        </p>
                    </div>

                    <DashboardCard className="min-w-64 bg-background/70 backdrop-blur">
                        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            Data status
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-foreground">
                            {dashboard.hasPartialErrors
                                ? "Partially loaded"
                                : "Synced"}
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {dashboard.hasPartialErrors
                                ? "Some detail requests did not respond, but the available information is still displayed."
                                : "Information updated from organizations and detail-by-ID endpoints."}
                        </p>
                    </DashboardCard>
                </div>
            </header>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                <DashboardStatCard
                    icon={Building2}
                    label="Organizations"
                    value={formatCompactNumber(dashboard.totals.organizations)}
                    helper="Total visible to the user"
                />
                <DashboardStatCard
                    icon={UsersRound}
                    label="Members"
                    value={formatCompactNumber(dashboard.totals.members)}
                    helper="Accumulated memberships"
                />
                <DashboardStatCard
                    icon={FolderKanban}
                    label="Projects"
                    value={formatCompactNumber(dashboard.totals.projects)}
                    helper="Projects reported by organization"
                />
                <DashboardStatCard
                    icon={Activity}
                    label="Active"
                    value={formatCompactNumber(dashboard.totals.activeProjects)}
                    helper="Projects with ACTIVE status"
                />
            </section>

            <section className="space-y-5">
                <DashboardSectionHeader
                    title="All organizations"
                    description="Complete catalog with counts, owners, recent projects, and visible members."
                />
                <div className="grid gap-5 xl:grid-cols-2 2xl:grid-cols-3">
                    {visibleOrganizations.map((organization) => (
                        <DashboardOrganizationCard
                            key={organization.id}
                            organization={organization}
                        />
                    ))}
                </div>
                {hasMoreOrganizations && !showAllOrganizations ? (
                    <div className="flex justify-center pt-2">
                        <Button
                            type="button"
                            size="lg"
                            className="shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                            onClick={() => setShowAllOrganizations(true)}
                        >
                            View more organizations
                            <ChevronDown className="size-4 animate-bounce" />
                        </Button>
                    </div>
                ) : null}
            </section>

            <DashboardInsights
                latestProjects={dashboard.latestProjects}
                recentOrganizations={dashboard.recentOrganizations}
                roleDistribution={dashboard.roleDistribution}
            />
        </div>
    );
}
