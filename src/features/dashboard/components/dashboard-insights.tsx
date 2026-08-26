import { Link } from "react-router-dom";
import { ArrowRight, Crown, FolderKanban, ShieldCheck, UsersRound } from "lucide-react";
import type { DashboardOrganization, DashboardProject } from "../api/use-dashboard-data";
import { formatDashboardDate, getProjectStatusTone, MEMBER_ROLE_LABELS, PROJECT_STATUS_LABELS } from "../utils/dashboard.utils";
import { pathBuilder } from "@/shared/config/routes";
import { cn } from "@/shared/utils/utils";
import { DashboardSectionHeader } from "./dashboard-card";

type DashboardInsightsProps = {
    latestProjects: DashboardProject[];
    recentOrganizations: DashboardOrganization[];
    roleDistribution: Record<string, number>;
};

export function DashboardInsights({ latestProjects, recentOrganizations, roleDistribution }: DashboardInsightsProps) {
    return (
        <section className="overflow-hidden rounded-xl bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
                <DashboardSectionHeader title="Operational activity" description="Projects, permission distribution, and recently active workspaces." />
            </div>
            <div className="grid xl:grid-cols-[1.45fr_1fr]">
                <div className="border-b border-border xl:border-r xl:border-b-0">
                    <PanelLabel>Project activity</PanelLabel>
                    <div className="divide-y divide-border">
                        {latestProjects.length > 0 ? latestProjects.map((project) => (
                            <Link key={`${project.organizationId}-${project.id}`} to={pathBuilder.orgProjectId(project.organizationId, project.id)} className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-surface-subtle">
                                <span className="flex min-w-0 items-center gap-3">
                                    <FolderKanban className="size-4 shrink-0 text-primary" />
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-semibold text-foreground">{project.name}</span>
                                        <span className="block truncate text-xs text-muted-foreground">{project.organizationName} · {formatDashboardDate(project.createdAt)}</span>
                                    </span>
                                </span>
                                <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold", getProjectStatusTone(project.status))}>{PROJECT_STATUS_LABELS[project.status]}</span>
                            </Link>
                        )) : <EmptyRow icon={FolderKanban} title="No projects yet" />}
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 xl:grid-cols-1">
                    <div className="border-b border-border sm:border-r xl:border-r-0">
                        <PanelLabel>Organization roles</PanelLabel>
                        <div className="divide-y divide-border">
                            {Object.entries(roleDistribution).length > 0 ? Object.entries(roleDistribution).map(([role, count]) => (
                                <div key={role} className="flex items-center justify-between px-5 py-3">
                                    <span className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
                                        {role === "OWNER" ? <Crown className="size-4 text-primary" /> : <ShieldCheck className="size-4 text-muted-foreground" />}
                                        {MEMBER_ROLE_LABELS[role as keyof typeof MEMBER_ROLE_LABELS] ?? role}
                                    </span>
                                    <span className="font-extrabold tabular-nums text-foreground">{count}</span>
                                </div>
                            )) : <EmptyRow icon={UsersRound} title="No roles available" />}
                        </div>
                    </div>

                    <div>
                        <PanelLabel>Recent organizations</PanelLabel>
                        <div className="divide-y divide-border">
                            {recentOrganizations.map((organization) => (
                                <Link key={organization.id} to={pathBuilder.org(organization.id)} className="group flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-surface-subtle">
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-semibold text-foreground">{organization.name}</span>
                                        <span className="block text-xs text-muted-foreground">{organization.memberCount} members · {organization.projectCount} projects</span>
                                    </span>
                                    <ArrowRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
    return <p className="control-label border-b border-border bg-surface-subtle/70 px-5 py-2.5">{children}</p>;
}

function EmptyRow({ icon: Icon, title }: { icon: typeof FolderKanban; title: string }) {
    return (
        <div className="flex items-center gap-3 px-5 py-6 text-sm text-muted-foreground">
            <Icon className="size-4" /> {title}
        </div>
    );
}
