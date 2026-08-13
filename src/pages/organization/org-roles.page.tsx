import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, RefreshCw, ShieldCheck, X } from "lucide-react";
import { useOrganizationsControllerFindOne } from "@/shared/api/generated";
import { DashboardCard, DashboardSectionHeader, DashboardShell } from "@/features/dashboard";
import {
    MembersSection,
    OrgErrorState,
    OrgPageSkeleton,
    ROLE_OPTIONS,
} from "@/features/organization-id";
import { Button } from "@/shared/ui/button";
import { pathBuilder } from "@/shared/config/routes";
import { cn } from "@/shared/utils/utils";

type PermissionRow = {
    action: string;
    allowed: Record<"OWNER" | "ADMIN" | "MEMBER" | "VIEWER", boolean>;
};

const PERMISSIONS: PermissionRow[] = [
    {
        action: "View organization, projects & tasks",
        allowed: { OWNER: true, ADMIN: true, MEMBER: true, VIEWER: true },
    },
    {
        action: "Create / delete projects",
        allowed: { OWNER: true, ADMIN: true, MEMBER: true, VIEWER: false },
    },
    {
        action: "Add / remove members",
        allowed: { OWNER: true, ADMIN: true, MEMBER: false, VIEWER: false },
    },
    {
        action: "Update member roles",
        allowed: { OWNER: true, ADMIN: true, MEMBER: false, VIEWER: false },
    },
    {
        action: "Update organization details",
        allowed: { OWNER: true, ADMIN: false, MEMBER: false, VIEWER: false },
    },
    {
        action: "Delete organization",
        allowed: { OWNER: true, ADMIN: false, MEMBER: false, VIEWER: false },
    },
];

export default function OrgRolesPage() {
    const { orgId } = useParams<{ orgId: string }>();
    const id = Number(orgId);

    const { data: org, isLoading, isError, refetch, isFetching } =
        useOrganizationsControllerFindOne(id);

    const isRefreshing = isFetching && !isLoading;

    if (isLoading) return <OrgPageSkeleton />;

    if (isError || !org) {
        return (
            <DashboardShell>
                <OrgErrorState onRetry={() => void refetch()} />
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Button asChild variant="outline" size="sm">
                    <Link to={pathBuilder.org(org.id)}>
                        <ArrowLeft className="size-4" />
                        {org.name}
                    </Link>
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isRefreshing}
                    onClick={() => void refetch()}
                >
                    <RefreshCw className={isRefreshing ? "size-4 animate-spin" : "size-4"} />
                    Refresh
                </Button>
            </div>

            <DashboardCard>
                <DashboardSectionHeader
                    title="Roles & Permissions"
                    description={`What each role can do in ${org.name}.`}
                />

                <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-primary/10">
                                <th className="px-4 py-3 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                                    Action
                                </th>
                                {ROLE_OPTIONS.map((option) => (
                                    <th
                                        key={option.value}
                                        className="px-4 py-3 text-center text-[11px] font-bold tracking-wider text-muted-foreground uppercase"
                                    >
                                        {option.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {PERMISSIONS.map((row) => (
                                <tr key={row.action} className="border-b border-border/60">
                                    <td className="px-4 py-3 font-medium text-foreground">
                                        {row.action}
                                    </td>
                                    {ROLE_OPTIONS.map((option) => (
                                        <td key={option.value} className="px-4 py-3 text-center">
                                            {row.allowed[option.value] ? (
                                                <Check className="mx-auto size-4 text-emerald-600 dark:text-emerald-400" />
                                            ) : (
                                                <X className="mx-auto size-4 text-muted-foreground/30" />
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {ROLE_OPTIONS.map((option) => (
                        <div
                            key={option.value}
                            className={cn(
                                "rounded-2xl border border-border/70 bg-muted/20 p-4"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="size-4 text-primary" />
                                <p className="text-sm font-bold text-foreground">
                                    {option.label}
                                </p>
                            </div>
                            <p className="mt-1.5 text-xs text-muted-foreground">
                                {option.description}
                            </p>
                        </div>
                    ))}
                </div>
            </DashboardCard>

            <MembersSection members={org.OrganizationUser} orgId={org.id} />
        </DashboardShell>
    );
}
