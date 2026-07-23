import type { UserResponseDtoRoles } from "@/shared/api/generated";
import { cn } from "@/shared/utils/utils";
import {
    formatGlobalRole,
    getGlobalRoleTone,
} from "../utils/organizations.utils";

type GlobalRoleBadgeProps = {
    role: UserResponseDtoRoles;
    className?: string;
};

export function GlobalRoleBadge({ role, className }: GlobalRoleBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
                getGlobalRoleTone(role),
                className
            )}
        >
            {formatGlobalRole(role)}
        </span>
    );
}
