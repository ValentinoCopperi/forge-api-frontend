import type {
    OrganizationsGetAllByUserResponseDtoRole,
    OrganizationsGetAllResponseDto,
    OrganizationsGetAllByUserResponseDto,
    OrganizationUserResponseDto,
    OrganizationCountResponseDto,
} from "@/shared/api/generated";

export type OrganizationListTab = "mine" | "all";

export type OrganizationTableRow = {
    id: number;
    name: string;
    description: string | null;
    logoUrl: string | null;
    createdAt: string;
    updatedAt: string;
    creator: OrganizationUserResponseDto;
    counts: OrganizationCountResponseDto;
    role: OrganizationsGetAllByUserResponseDtoRole | null;
    isMember: boolean;
};

export function toOrganizationTableRowFromUserOrg(
    organization: OrganizationsGetAllByUserResponseDto
): OrganizationTableRow {
    return {
        id: organization.id,
        name: organization.name,
        description: organization.description,
        logoUrl: organization.logoUrl,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
        creator: organization.User_Organization_createdByUserIdToUser,
        counts: organization._count,
        role: organization.role,
        isMember: true,
    };
}

export function toOrganizationTableRowsFromAll(
    organizations: OrganizationsGetAllResponseDto[],
    userOrganizations: OrganizationsGetAllByUserResponseDto[]
): OrganizationTableRow[] {
    const roleByOrgId = new Map(
        userOrganizations.map((org) => [org.id, org.role])
    );

    return organizations.map((organization) => ({
        id: organization.id,
        name: organization.name,
        description: organization.description,
        logoUrl: organization.logoUrl,
        createdAt: organization.createdAt,
        updatedAt: organization.updatedAt,
        creator: organization.User_Organization_createdByUserIdToUser,
        counts: organization._count,
        role: roleByOrgId.get(organization.id) ?? null,
        isMember: roleByOrgId.has(organization.id),
    }));
}

export function buildUserRoleLookup(
    userOrganizations: OrganizationsGetAllByUserResponseDto[]
) {
    return new Map(userOrganizations.map((org) => [org.id, org.role]));
}
