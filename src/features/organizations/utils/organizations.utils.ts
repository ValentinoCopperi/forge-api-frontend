import type {
    OrganizationsGetAllByUserResponseDtoRole,
    UserResponseDtoRoles,
} from "@/shared/api/generated";
import { UserResponseDtoRoles as UserRoles } from "@/shared/api/generated";
import { MEMBER_ROLE_LABELS } from "@/features/dashboard/utils/dashboard.utils";
import { formatDashboardDate } from "@/features/dashboard/utils/dashboard.utils";

export { formatDashboardDate as formatOrganizationDate };

export const ORGANIZATION_ROLE_LABELS = MEMBER_ROLE_LABELS;

export function getOrganizationRoleTone(
    role: OrganizationsGetAllByUserResponseDtoRole
) {
    if (role === "OWNER") {
        return "border-chart-1/35 bg-chart-1/12 text-chart-1 shadow-sm shadow-chart-1/10";
    }

    if (role === "ADMIN") {
        return "border-chart-2/35 bg-chart-2/12 text-chart-2 shadow-sm shadow-chart-2/10";
    }

    if (role === "MEMBER") {
        return "border-chart-3/35 bg-chart-3/12 text-chart-3 shadow-sm shadow-chart-3/10";
    }

    return "border-muted-foreground/25 bg-muted/50 text-muted-foreground";
}

export function getGlobalRoleTone(role: UserResponseDtoRoles) {
    if (role === "DIRECTOR") {
        return "border-chart-1/35 bg-chart-1/12 text-chart-1";
    }

    if (role === "GERENTE") {
        return "border-chart-2/35 bg-chart-2/12 text-chart-2";
    }

    return "border-chart-4/35 bg-chart-4/12 text-chart-4";
}

export function normalizeUserRoles(
    roles: UserResponseDtoRoles | UserResponseDtoRoles[] | undefined
): UserResponseDtoRoles[] {
    if (!roles) {
        return [];
    }

    return Array.isArray(roles) ? roles : [roles];
}

export function canCreateOrganization(
    roles: UserResponseDtoRoles | UserResponseDtoRoles[] | undefined
) {
    return normalizeUserRoles(roles).includes(UserRoles.DIRECTOR);
}

export function formatGlobalRole(role: UserResponseDtoRoles) {
    return role.charAt(0) + role.slice(1).toLowerCase();
}
