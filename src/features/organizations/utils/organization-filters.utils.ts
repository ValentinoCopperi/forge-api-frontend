import type { OrganizationTableRow } from "../types/organization-table.types";
import {
    DEFAULT_ORGANIZATION_FILTERS,
    type OrganizationFilterUser,
    type OrganizationFilters,
    type OrganizationRoleFilter,
} from "../types/organization-filters.types";

function parseDateBoundary(value: string, endOfDay: boolean) {
    if (!value.trim()) {
        return null;
    }

    const date = new Date(
        `${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`
    );

    return Number.isNaN(date.getTime()) ? null : date;
}

function parseOptionalNumber(value: string) {
    if (!value.trim()) {
        return null;
    }

    const parsed = Number(value);

    return Number.isNaN(parsed) ? null : parsed;
}

function matchesRoleFilter(
    organization: OrganizationTableRow,
    roles: OrganizationRoleFilter[]
) {
    if (roles.length === 0) {
        return true;
    }

    return roles.some((role) => {
        if (role === "NOT_MEMBER") {
            return !organization.isMember;
        }

        return organization.role === role;
    });
}

function matchesCreatorFilter(
    organization: OrganizationTableRow,
    creatorIds: number[]
) {
    if (creatorIds.length === 0) {
        return true;
    }

    return creatorIds.includes(organization.creator.id);
}

function matchesDateRange(isoDate: string, from: string, to: string) {
    const hasFrom = Boolean(from.trim());
    const hasTo = Boolean(to.trim());

    if (!hasFrom && !hasTo) {
        return true;
    }

    const date = new Date(isoDate);

    if (Number.isNaN(date.getTime())) {
        return false;
    }

    const fromDate = parseDateBoundary(from, false);
    const toDate = parseDateBoundary(to, true);

    if (fromDate && date < fromDate) {
        return false;
    }

    if (toDate && date > toDate) {
        return false;
    }

    return true;
}

function matchesNumericRange(value: number | undefined, min: string, max: string) {
    const normalizedValue = value ?? 0;
    const minValue = parseOptionalNumber(min);
    const maxValue = parseOptionalNumber(max);

    if (minValue === null && maxValue === null) {
        return true;
    }

    if (minValue !== null && normalizedValue < minValue) {
        return false;
    }

    if (maxValue !== null && normalizedValue > maxValue) {
        return false;
    }

    return true;
}

export function extractCreatorsFromRows(
    organizations: OrganizationTableRow[]
): OrganizationFilterUser[] {
    const creators = new Map<number, OrganizationFilterUser>();

    for (const organization of organizations) {
        const creator = organization.creator;
        const existing = creators.get(creator.id);

        if (existing) {
            existing.organizationCount += 1;
            continue;
        }

        creators.set(creator.id, {
            id: creator.id,
            name: creator.name,
            email: creator.email,
            avatarUrl: creator.avatarUrl,
            organizationCount: 1,
        });
    }

    return [...creators.values()].sort((a, b) =>
        a.name.localeCompare(b.name)
    );
}

export function countActiveOrganizationFilters(filters: OrganizationFilters) {
    let count = 0;

    if (filters.roles.length > 0) count += 1;
    if (filters.creatorIds.length > 0) count += 1;
    if (filters.createdFrom || filters.createdTo) count += 1;
    if (filters.updatedFrom || filters.updatedTo) count += 1;
    if (filters.membersMin || filters.membersMax) count += 1;
    if (filters.projectsMin || filters.projectsMax) count += 1;

    return count;
}

export function filterOrganizationRows(
    organizations: OrganizationTableRow[],
    filters: OrganizationFilters,
    searchQuery = ""
) {
    const query = searchQuery.trim().toLowerCase();

    return organizations.filter((organization) => {
        if (!matchesRoleFilter(organization, filters.roles)) {
            return false;
        }

        if (!matchesCreatorFilter(organization, filters.creatorIds)) {
            return false;
        }

        if (
            !matchesDateRange(
                organization.createdAt,
                filters.createdFrom,
                filters.createdTo
            )
        ) {
            return false;
        }

        if (
            !matchesDateRange(
                organization.updatedAt,
                filters.updatedFrom,
                filters.updatedTo
            )
        ) {
            return false;
        }

        if (
            !matchesNumericRange(
                organization.counts.OrganizationUser,
                filters.membersMin,
                filters.membersMax
            )
        ) {
            return false;
        }

        if (
            !matchesNumericRange(
                organization.counts.Project,
                filters.projectsMin,
                filters.projectsMax
            )
        ) {
            return false;
        }

        if (!query) {
            return true;
        }

        const creator = organization.creator;

        return (
            organization.name.toLowerCase().includes(query) ||
            organization.description?.toLowerCase().includes(query) ||
            creator.name.toLowerCase().includes(query) ||
            creator.email.toLowerCase().includes(query) ||
            organization.role?.toLowerCase().includes(query) ||
            (!organization.isMember &&
                "not a member".toLowerCase().includes(query))
        );
    });
}

export function resetOrganizationFilters() {
    return { ...DEFAULT_ORGANIZATION_FILTERS };
}

export function sanitizeOrganizationFilters(
    filters: OrganizationFilters,
    availableCreatorIds: number[]
): OrganizationFilters {
    const availableCreatorIdSet = new Set(availableCreatorIds);

    return {
        ...filters,
        creatorIds: filters.creatorIds.filter((id) =>
            availableCreatorIdSet.has(id)
        ),
    };
}
