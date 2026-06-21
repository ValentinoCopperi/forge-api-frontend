import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import {
    getOrganizationsControllerFindOneQueryOptions,
    useOrganizationsControllerFindAll,
    useOrganizationsControllerFindAllByUserId,
} from "@/shared/api/generated";
import type {
    OrganizationFindOneResponseDto,
    OrganizationMemberResponseDto,
    OrganizationOfUserDto,
    OrganizationProjectResponseDto,
    OrganizationsGetAllResponseDto,
} from "@/shared/api/generated";

const DASHBOARD_STALE_TIME = 60_000;

export type DashboardOrganization = {
    id: number;
    name: string;
    description: string | null;
    logoUrl: string | null;
    bannerUrl: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    creator: OrganizationsGetAllResponseDto["User_Organization_createdByUserIdToUser"] | null;
    memberCount: number;
    projectCount: number;
    members: OrganizationMemberResponseDto[];
    projects: OrganizationProjectResponseDto[];
};

export type DashboardProject = OrganizationProjectResponseDto & {
    organizationId: number;
    organizationName: string;
};

function isOrganizationDetail(
    value: unknown
): value is OrganizationFindOneResponseDto {
    return (
        typeof value === "object" &&
        value !== null &&
        "id" in value &&
        "Project" in value &&
        "OrganizationUser" in value
    );
}

function toDashboardOrganization(
    id: number,
    catalogOrganization?: OrganizationsGetAllResponseDto,
    userOrganization?: OrganizationOfUserDto,
    detail?: OrganizationFindOneResponseDto
): DashboardOrganization {
    const members = detail?.OrganizationUser ?? [];
    const projects = detail?.Project ?? [];

    return {
        id,
        name:
            detail?.name ??
            catalogOrganization?.name ??
            userOrganization?.name ??
            "Organization",
        description: detail?.description ?? catalogOrganization?.description ?? null,
        logoUrl: detail?.logoUrl ?? catalogOrganization?.logoUrl ?? userOrganization?.logoUrl ?? null,
        bannerUrl: detail?.bannerUrl ?? catalogOrganization?.bannerUrl ?? null,
        createdAt: detail?.createdAt ?? catalogOrganization?.createdAt ?? null,
        updatedAt: detail?.updatedAt ?? catalogOrganization?.updatedAt ?? null,
        creator:
            detail?.User_Organization_createdByUserIdToUser ??
            catalogOrganization?.User_Organization_createdByUserIdToUser ??
            null,
        memberCount:
            members.length || catalogOrganization?._count.OrganizationUser || 0,
        projectCount: projects.length || catalogOrganization?._count.Project || 0,
        members,
        projects,
    };
}

function sortByRecentActivity(
    left: DashboardOrganization,
    right: DashboardOrganization
) {
    const leftTime = getTimestamp(left.updatedAt ?? left.createdAt);
    const rightTime = getTimestamp(right.updatedAt ?? right.createdAt);

    if (leftTime !== rightTime) {
        return rightTime - leftTime;
    }

    return left.name.localeCompare(right.name);
}

function getTimestamp(value?: string | null) {
    if (!value) {
        return 0;
    }

    const timestamp = new Date(value).getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
}

export function useDashboardData() {
    const catalogQuery = useOrganizationsControllerFindAll({
        query: {
            staleTime: DASHBOARD_STALE_TIME,
            retry: 1,
        },
    });

    const userOrganizationsQuery = useOrganizationsControllerFindAllByUserId({
        query: {
            staleTime: DASHBOARD_STALE_TIME,
            retry: 1,
        },
    });

    const catalogOrganizations = catalogQuery.data?.data ?? [];
    const userOrganizations = userOrganizationsQuery.data?.data ?? [];

    const organizationIds = useMemo(() => {
        const ids = new Set<number>();

        for (const organization of catalogOrganizations) {
            ids.add(organization.id);
        }

        for (const organization of userOrganizations) {
            ids.add(organization.id);
        }

        return Array.from(ids);
    }, [catalogOrganizations, userOrganizations]);

    const detailQueries = useQueries({
        queries: organizationIds.map((id) => ({
            ...getOrganizationsControllerFindOneQueryOptions(id, {
                query: {
                    staleTime: DASHBOARD_STALE_TIME,
                    retry: 1,
                },
            }),
            enabled: Boolean(id),
        })),
    });

    return useMemo(() => {
        const catalogById = new Map(
            catalogOrganizations.map((organization) => [
                organization.id,
                organization,
            ])
        );
        const userOrganizationById = new Map(
            userOrganizations.map((organization) => [organization.id, organization])
        );
        const detailById = new Map<number, OrganizationFindOneResponseDto>();

        for (const query of detailQueries) {
            if (isOrganizationDetail(query.data)) {
                detailById.set(query.data.id, query.data);
            }
        }

        const organizations = organizationIds
            .map((id) =>
                toDashboardOrganization(
                    id,
                    catalogById.get(id),
                    userOrganizationById.get(id),
                    detailById.get(id)
                )
            )
            .sort(sortByRecentActivity);

        const projects: DashboardProject[] = organizations.flatMap((organization) =>
            organization.projects.map((project) => ({
                ...project,
                organizationId: organization.id,
                organizationName: organization.name,
            }))
        );

        const members = organizations.flatMap(
            (organization) => organization.members
        );

        const activeProjects = projects.filter(
            (project) => project.status === "ACTIVE"
        ).length;

        const roleDistribution = members.reduce<Record<string, number>>(
            (accumulator, member) => {
                accumulator[member.role] = (accumulator[member.role] ?? 0) + 1;
                return accumulator;
            },
            {}
        );

        return {
            organizations,
            latestProjects: [...projects]
                .sort(
                    (left, right) =>
                        getTimestamp(right.createdAt) -
                        getTimestamp(left.createdAt)
                )
                .slice(0, 6),
            recentOrganizations: organizations.slice(0, 4),
            roleDistribution,
            totals: {
                organizations: organizations.length,
                members: organizations.reduce(
                    (total, organization) => total + organization.memberCount,
                    0
                ),
                projects: organizations.reduce(
                    (total, organization) => total + organization.projectCount,
                    0
                ),
                activeProjects,
            },
            isLoading:
                organizationIds.length === 0 &&
                (catalogQuery.isLoading || userOrganizationsQuery.isLoading),
            isError: catalogQuery.isError && userOrganizationsQuery.isError,
            isRefreshing:
                catalogQuery.isFetching ||
                userOrganizationsQuery.isFetching ||
                detailQueries.some((query) => query.isFetching),
            hasPartialErrors:
                catalogQuery.isError ||
                userOrganizationsQuery.isError ||
                detailQueries.some((query) => query.isError),
        };
    }, [
        catalogOrganizations,
        catalogQuery.isError,
        catalogQuery.isFetching,
        catalogQuery.isLoading,
        detailQueries,
        organizationIds,
        userOrganizations,
        userOrganizationsQuery.isError,
        userOrganizationsQuery.isFetching,
        userOrganizationsQuery.isLoading,
    ]);
}
