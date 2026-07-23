import type { OrganizationsGetAllByUserResponseDtoRole } from "@/shared/api/generated";
import { cn } from "@/shared/utils/utils";
import {
    getOrganizationRoleTone,
    ORGANIZATION_ROLE_LABELS,
} from "../utils/organizations.utils";

type OrganizationRoleBadgeProps = {
    role: OrganizationsGetAllByUserResponseDtoRole;
    className?: string;
};

export function OrganizationRoleBadge({
    role,
    className,
}: OrganizationRoleBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
                getOrganizationRoleTone(role),
                className
            )}
        >
            {ORGANIZATION_ROLE_LABELS[role]}
        </span>
    );
}
