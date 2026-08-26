import { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import { Activity, Building2, ChevronDown, FolderKanban, UsersRound } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
    DashboardEmptyState,
    DashboardErrorState,
    DashboardHero,
    DashboardInsights,
    DashboardLoadingState,
    DashboardOrganizationCard,
    DashboardSectionHeader,
    DashboardShell,
    DashboardStatCard,
    formatCompactNumber,
    useDashboardData,
} from "@/features/dashboard";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { useLocalStorage } from "@/shared/hooks";
import { HAS_SEEN_ON_BOARDING } from "@/shared/constants";
import { TutorialModal } from "@/shared/components/tutorial";
import { toast } from "sonner";

const INITIAL_ORGANIZATIONS_LIMIT = 3;

export default function DashboardPage() {
    const [showAllOrganizations, setShowAllOrganizations] = useState(false);
    const [play] = useSound("/sounds/notification-sound.wav");
    const user = useAuthStore((state) => state.user);
    const { data, setDataStorage } = useLocalStorage<boolean>(HAS_SEEN_ON_BOARDING, false);
    const dashboard = useDashboardData();
    const hasWelcomed = useRef(false);

    useEffect(() => {
        if (hasWelcomed.current) return;
        if (dashboard.isLoading || dashboard.isError) return;

        hasWelcomed.current = true;
        play();
        toast.success("Welcome to Forge", {
            description: "Navigate to /tutorial to get started",
            duration: 4000,
            position: "bottom-right",
        });
    }, [dashboard.isLoading, dashboard.isError, play]);

    if (dashboard.isLoading) {
        return (
            <DashboardShell>
                <DashboardLoadingState />
            </DashboardShell>
        );
    }

    if (dashboard.isError) {
        return (
            <DashboardShell>
                <DashboardErrorState />
            </DashboardShell>
        );
    }

    if (dashboard.organizations.length === 0) {
        return (
            <DashboardShell>
                <DashboardEmptyState />
            </DashboardShell>
        );
    }

    const hasMoreOrganizations =
        dashboard.organizations.length > INITIAL_ORGANIZATIONS_LIMIT;
    const visibleOrganizations = showAllOrganizations
        ? dashboard.organizations
        : dashboard.organizations.slice(0, INITIAL_ORGANIZATIONS_LIMIT);

    return (
        <DashboardShell>
            <div className="overflow-hidden rounded-xl bg-card shadow-sm">
                <DashboardHero
                    className="rounded-none shadow-none"
                    badge={{ icon: Activity, label: "Executive summary" }}
                    title={
                        <>
                            Hello{user?.name ? `, ${user.name}` : ""}.
                            <span className="block text-primary sm:inline sm:ml-2">
                                Your workspace overview.
                            </span>
                        </>
                    }
                    description="A centralized view of organizations, members, projects, owners, and roles — synced from the latest API response."
                    meta={
                        dashboard.isRefreshing ? (
                            <span className="inline-flex items-center gap-2 rounded-full bg-info-soft px-3 py-1 text-xs font-semibold text-info">
                                <Spinner className="size-3.5" /> Refreshing data...
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
                                <span className="size-1.5 rounded-full bg-success" /> Latest response loaded
                            </span>
                        )
                    }
                />
                <section className="grid border-t border-border md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4 [&>*]:border-b [&>*]:border-border md:[&>*]:border-b-0">
                    <DashboardStatCard accent="primary" icon={Building2} label="Organizations" value={formatCompactNumber(dashboard.totals.organizations)} helper="Total visible to the user" />
                    <DashboardStatCard accent="blue" icon={UsersRound} label="Members" value={formatCompactNumber(dashboard.totals.members)} helper="Accumulated memberships" />
                    <DashboardStatCard accent="emerald" icon={FolderKanban} label="Projects" value={formatCompactNumber(dashboard.totals.projects)} helper="Projects reported by organization" />
                    <DashboardStatCard accent="amber" icon={Activity} label="Active" value={formatCompactNumber(dashboard.totals.activeProjects)} helper="Projects with ACTIVE status" />
                </section>
            </div>

            <section className="space-y-5">
                <DashboardSectionHeader
                    title="All organizations"
                    description="Complete catalog with counts, owners, recent projects, and visible members."
                />
                <div className="overflow-hidden rounded-xl bg-card shadow-sm divide-y divide-border">
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
                            className="h-10 rounded-md px-4 shadow-sm"
                            onClick={() => setShowAllOrganizations(true)}
                        >
                            View more organizations
                            <ChevronDown className="size-4 animate-[float_1.8s_ease-in-out_infinite]" />
                        </Button>
                    </div>
                ) : null}
            </section>



            <DashboardInsights
                latestProjects={dashboard.latestProjects}
                recentOrganizations={dashboard.recentOrganizations}
                roleDistribution={dashboard.roleDistribution}
            />

            {!data ? (
                <TutorialModal
                    open={true}
                    onOpenChange={() => {}}
                    onComplete={() => {
                        setDataStorage(true);
                    }}
                />
            ) : null}
        </DashboardShell>
    );
}
