import { useEffect, useMemo, useState } from "react";
import {
    useOrganizationsControllerFindAll,
    useOrganizationsControllerFindAllByUserId,
} from "@/shared/api/generated";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { DashboardShell } from "@/features/dashboard";
import {
    canCreateOrganization,
    CreateOrganizationDialog,
    OrganizationsEmptyState,
    OrganizationsErrorState,
    OrganizationsPageHeader,
    OrganizationsPageSkeleton,
    OrganizationsTable,
    OrganizationsTableCard,
} from "@/features/organizations";
import { DEFAULT_ORGANIZATION_FILTERS } from "@/features/organizations/types/organization-filters.types";
import { useActiveOrganizationId } from "@/features/organizations/hooks/use-active-organization-id";
import type { OrganizationListTab } from "@/features/organizations/types/organization-table.types";
import {
    toOrganizationTableRowFromUserOrg,
    toOrganizationTableRowsFromAll,
} from "@/features/organizations/types/organization-table.types";
import {
    extractCreatorsFromRows,
    filterOrganizationRows,
    resetOrganizationFilters,
    sanitizeOrganizationFilters,
    countActiveOrganizationFilters,
} from "@/features/organizations/utils/organization-filters.utils";

export default function OrganizationsPage() {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<OrganizationListTab>("mine");
    const [filters, setFilters] = useState(DEFAULT_ORGANIZATION_FILTERS);
    const [search, setSearch] = useState("");

    const user = useAuthStore((state) => state.user);
    const isDirector = canCreateOrganization(user?.roles);

    const mineQuery = useOrganizationsControllerFindAllByUserId();
    const allQuery = useOrganizationsControllerFindAll();

    const myOrganizations = mineQuery.data?.data ?? [];
    const allOrganizations = allQuery.data?.data ?? [];

    const activeOrganizationId = useActiveOrganizationId(myOrganizations);

    const tableRows = useMemo(() => {
        if (activeTab === "mine") {
            return myOrganizations.map(toOrganizationTableRowFromUserOrg);
        }

        return toOrganizationTableRowsFromAll(allOrganizations, myOrganizations);
    }, [activeTab, allOrganizations, myOrganizations]);

    const availableCreators = useMemo(
        () => extractCreatorsFromRows(tableRows),
        [tableRows]
    );

    const effectiveFilters = useMemo(
        () =>
            sanitizeOrganizationFilters(
                filters,
                availableCreators.map((creator) => creator.id)
            ),
        [filters, availableCreators]
    );

    const filteredRows = useMemo(
        () => filterOrganizationRows(tableRows, effectiveFilters, search),
        [tableRows, effectiveFilters, search]
    );

    useEffect(() => {
        setFilters(resetOrganizationFilters());
        setSearch("");
    }, [activeTab]);

    const isInitialLoading = mineQuery.isLoading;
    const isRefreshing =
        (mineQuery.isFetching && !mineQuery.isLoading) ||
        (allQuery.isFetching && !allQuery.isLoading);

    const handleCreateClick = () => setCreateDialogOpen(true);

    const handleRefresh = () => {
        void Promise.all([mineQuery.refetch(), allQuery.refetch()]);
    };

    if (mineQuery.isError) {
        return (
            <DashboardShell>
                <OrganizationsErrorState onRetry={handleRefresh} />
            </DashboardShell>
        );
    }

    if (isInitialLoading) {
        return (
            <DashboardShell>
                <OrganizationsPageHeader
                    onCreateClick={handleCreateClick}
                    isLoading
                />
                <OrganizationsPageSkeleton />
            </DashboardShell>
        );
    }

    const showPageEmptyState =
        myOrganizations.length === 0 && allOrganizations.length === 0;

    if (showPageEmptyState) {
        return (
            <DashboardShell>
                <OrganizationsPageHeader onCreateClick={handleCreateClick} />
                <OrganizationsEmptyState
                    canCreate={isDirector}
                    onCreateClick={handleCreateClick}
                />
                <CreateOrganizationDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                />
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <OrganizationsPageHeader onCreateClick={handleCreateClick} />

            <OrganizationsTableCard
                activeTab={activeTab}
                onTabChange={setActiveTab}
                mineCount={myOrganizations.length}
                allCount={allOrganizations.length}
                isRefreshing={isRefreshing}
                onRefresh={handleRefresh}
                allTabError={allQuery.isError}
                onRetryAll={() => void allQuery.refetch()}
                filters={filters}
                onFiltersChange={setFilters}
                onFiltersReset={() => setFilters(resetOrganizationFilters())}
                filteredCount={filteredRows.length}
                totalCount={tableRows.length}
                creators={availableCreators}
            >
                <div className="p-5 sm:p-6">
                    <OrganizationsTable
                        organizations={filteredRows}
                        totalCount={tableRows.length}
                        search={search}
                        onSearchChange={setSearch}
                        activeOrganizationId={activeOrganizationId}
                        isRefreshing={isRefreshing}
                        showMembershipRole
                        hasActiveFilters={
                            countActiveOrganizationFilters(effectiveFilters) >
                                0 || search.trim().length > 0
                        }
                        emptyMessage={
                            activeTab === "mine"
                                ? "You are not part of any organization yet."
                                : "No organizations are registered in the platform."
                        }
                    />
                </div>
            </OrganizationsTableCard>

            <CreateOrganizationDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
        </DashboardShell>
    );
}
