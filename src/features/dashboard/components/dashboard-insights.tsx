import { Link } from "react-router-dom";
import { ArrowRight, Crown, FolderKanban, ShieldCheck, UsersRound } from "lucide-react";
import type { DashboardOrganization, DashboardProject } from "../api/use-dashboard-data";
import {
    formatDashboardDate,
    getProjectStatusTone,
    MEMBER_ROLE_LABELS,
    PROJECT_STATUS_LABELS,
} from "../utils/dashboard.utils";
import { pathBuilder } from "@/shared/config/routes";
import { cn } from "@/shared/utils/utils";
import { DashboardCard, DashboardSectionHeader } from "./dashboard-card";

type DashboardInsightsProps = {
    latestProjects: DashboardProject[];
    recentOrganizations: DashboardOrganization[];
    roleDistribution: Record<string, number>;
};

export function DashboardInsights({
    latestProjects,
    recentOrganizations,
    roleDistribution,
}: DashboardInsightsProps) {
    return (
        <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
            <DashboardCard>
                <DashboardSectionHeader
                    title="Project activity"
                    description="Latest projects detected across organizations."
                />
                <div className="mt-5 space-y-3">
                    {latestProjects.length > 0 ? (
                        latestProjects.map((project) => (
                            <Link
                                key={`${project.organizationId}-${project.id}`}
                                to={pathBuilder.orgProjectId(
                                    project.organizationId,
                                    project.id
                                )}
                                className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-3 transition-colors hover:bg-muted/50"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <FolderKanban className="size-5" />
                                    </span>
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-semibold text-foreground">
                                            {project.name}
                                        </span>
                                        <span className="block truncate text-xs text-muted-foreground">
                                            {project.organizationName} -{" "}
                                            {formatDashboardDate(project.createdAt)}
                                        </span>
                                    </span>
                                </div>
                                <span
                                    className={cn(
                                        "shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium",
                                        getProjectStatusTone(project.status)
                                    )}
                                >
                                    {PROJECT_STATUS_LABELS[project.status]}
                                </span>
                            </Link>
                        ))
                    ) : (
                        <EmptyInsight
                            icon={FolderKanban}
                            title="No projects yet"
                            description="When the backend exposes projects in an organization, they will appear here."
                        />
                    )}
                </div>
            </DashboardCard>

            <div className="grid gap-5">
                <DashboardCard>
                    <DashboardSectionHeader
                        title="Organization roles"
                        description="Permission distribution by membership."
                    />
                    <div className="mt-5 space-y-3">
                        {Object.entries(roleDistribution).length > 0 ? (
                            Object.entries(roleDistribution).map(([role, count]) => (
                                <div
                                    key={role}
                                    className="flex items-center justify-between rounded-2xl bg-muted/40 px-4 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            {role === "OWNER" ? (
                                                <Crown className="size-4" />
                                            ) : (
                                                <ShieldCheck className="size-4" />
                                            )}
                                        </span>
                                        <span>
                                            <span className="block text-sm font-medium text-foreground">
                                                {MEMBER_ROLE_LABELS[
                                                    role as keyof typeof MEMBER_ROLE_LABELS
                                                ] ?? role}
                                            </span>
                                            <span className="block text-xs text-muted-foreground">
                                                Registered memberships
                                            </span>
                                        </span>
                                    </div>
                                    <span className="text-lg font-semibold text-foreground">
                                        {count}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <EmptyInsight
                                icon={UsersRound}
                                title="No roles available"
                                description="Roles will appear after organization details are loaded."
                            />
                        )}
                    </div>
                </DashboardCard>

                <DashboardCard>
                    <DashboardSectionHeader
                        title="Recent organizations"
                        description="Quick access based on activity."
                    />
                    <div className="mt-5 space-y-2">
                        {recentOrganizations.map((organization) => (
                            <Link
                                key={organization.id}
                                to={pathBuilder.org(organization.id)}
                                className="group flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-muted/60"
                            >
                                <span className="min-w-0">
                                    <span className="block truncate text-sm font-medium text-foreground">
                                        {organization.name}
                                    </span>
                                    <span className="block text-xs text-muted-foreground">
                                        {organization.memberCount} members -{" "}
                                        {organization.projectCount} projects
                                    </span>
                                </span>
                                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                            </Link>
                        ))}
                    </div>
                </DashboardCard>
            </div>
        </div>
    );
}

function EmptyInsight({
    icon: Icon,
    title,
    description,
}: {
    icon: typeof FolderKanban;
    title: string;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-dashed border-border p-5 text-center">
            <Icon className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium text-foreground">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
    );
}
