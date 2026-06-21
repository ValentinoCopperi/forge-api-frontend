import type {
    OrganizationMemberResponseDtoRole,
    OrganizationProjectResponseDtoStatus,
} from "@/shared/api/generated";

export const PROJECT_STATUS_LABELS: Record<
    OrganizationProjectResponseDtoStatus,
    string
> = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
    ARCHIVED: "Archived",
    DELETED: "Deleted",
    PAUSED: "Paused",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
};

export const MEMBER_ROLE_LABELS: Record<OrganizationMemberResponseDtoRole, string> =
    {
        OWNER: "Owner",
        ADMIN: "Admin",
        MEMBER: "Member",
        VIEWER: "Viewer",
    };

export function formatDashboardDate(value?: string | null) {
    if (!value) {
        return "No date";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "No date";
    }

    return new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

export function formatCompactNumber(value: number) {
    return new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}

export function getProjectStatusTone(
    status: OrganizationProjectResponseDtoStatus
) {
    if (status === "ACTIVE") {
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
    }

    if (status === "COMPLETED") {
        return "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300";
    }

    if (status === "PAUSED" || status === "INACTIVE") {
        return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300";
    }

    if (status === "ARCHIVED") {
        return "border-muted bg-muted text-muted-foreground";
    }

    return "border-destructive/20 bg-destructive/10 text-destructive";
}
