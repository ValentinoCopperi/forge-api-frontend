import { Link } from "react-router-dom";
import { Building2, CalendarDays, FolderKanban, ShieldCheck, Users } from "lucide-react";
import type { DashboardOrganization } from "../api/use-dashboard-data";
import {
    formatDashboardDate,
    getProjectStatusTone,
    PROJECT_STATUS_LABELS,
} from "../utils/dashboard.utils";
import { pathBuilder } from "@/shared/config/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { cn } from "@/shared/utils/utils";
import { DashboardCard } from "./dashboard-card";

type DashboardOrganizationCardProps = {
    organization: DashboardOrganization;
};

export function DashboardOrganizationCard({
    organization,
}: DashboardOrganizationCardProps) {
    const logoSrc = getAvatarSrc(organization.logoUrl);
    const recentProjects = organization.projects.slice(0, 3);
    const previewMembers = organization.members.slice(0, 4);

    return (
        <DashboardCard className="overflow-hidden p-0">
            <div className="relative h-28 bg-gradient-to-br from-primary/25 via-primary/10 to-muted">
                {organization.bannerUrl ? (
                    <img
                        src={organization.bannerUrl}
                        alt=""
                        className="absolute inset-0 size-full object-cover"
                    />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            </div>

            <div className="-mt-10 space-y-5 p-5 pt-0">
                <div className="relative flex items-end justify-between gap-4">
                    <Avatar className="size-20 border-4 border-card shadow-sm">
                        {logoSrc ? (
                            <AvatarImage src={logoSrc} alt={organization.name} />
                        ) : null}
                        <AvatarFallback className="bg-primary text-lg font-semibold text-primary-foreground">
                            {getInitials(organization.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link to={pathBuilder.orgProjects(organization.id)}>
                                Projects
                            </Link>
                        </Button>
                        <Button asChild size="sm">
                            <Link to={pathBuilder.org(organization.id)}>Open</Link>
                        </Button>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold tracking-tight text-foreground">
                        {organization.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 min-h-10 text-sm text-muted-foreground">
                        {organization.description ??
                            "Organization without a public description yet."}
                    </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                    <Metric
                        icon={Users}
                        label="Members"
                        value={organization.memberCount}
                    />
                    <Metric
                        icon={FolderKanban}
                        label="Projects"
                        value={organization.projectCount}
                    />
                    <Metric
                        icon={CalendarDays}
                        label="Created"
                        value={formatDashboardDate(organization.createdAt)}
                        compact
                    />
                </div>

                <div className="space-y-3 rounded-2xl border border-border bg-muted/30 p-3">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            Recent projects
                        </p>
                        <Link
                            to={pathBuilder.orgRoles(organization.id)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                            <ShieldCheck className="size-3.5" />
                            Roles
                        </Link>
                    </div>

                    {recentProjects.length > 0 ? (
                        <div className="space-y-2">
                            {recentProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="flex items-center justify-between gap-3 rounded-xl bg-background px-3 py-2"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-foreground">
                                            {project.name}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            Manager:{" "}
                                            {project.User_Project_managerIdToUser.name}
                                        </p>
                                    </div>
                                    <span
                                        className={cn(
                                            "shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                                            getProjectStatusTone(project.status)
                                        )}
                                    >
                                        {PROJECT_STATUS_LABELS[project.status]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 rounded-xl bg-background px-3 py-3 text-sm text-muted-foreground">
                            <Building2 className="size-4" />
                            No registered projects
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Created by</p>
                        <p className="truncate text-sm font-medium text-foreground">
                            {organization.creator?.name ?? "No owner"}
                        </p>
                    </div>
                    <div className="flex -space-x-2">
                        {previewMembers.length > 0 ? (
                            previewMembers.map((member) => (
                                <Avatar
                                    key={member.id}
                                    className="size-8 border-2 border-card"
                                >
                                    {getAvatarSrc(member.User.avatarUrl) ? (
                                        <AvatarImage
                                            src={getAvatarSrc(member.User.avatarUrl)}
                                            alt={member.User.name}
                                        />
                                    ) : null}
                                    <AvatarFallback className="bg-muted text-[11px] font-semibold text-muted-foreground">
                                        {getInitials(member.User.name)}
                                    </AvatarFallback>
                                </Avatar>
                            ))
                        ) : (
                            <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                                No members
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </DashboardCard>
    );
}

function Metric({
    icon: Icon,
    label,
    value,
    compact,
}: {
    icon: typeof Users;
    label: string;
    value: number | string;
    compact?: boolean;
}) {
    return (
        <div className="rounded-2xl border border-border bg-background p-3">
            <Icon className="mb-2 size-4 text-primary" />
            <p
                className={cn(
                    "font-semibold text-foreground",
                    compact ? "text-xs" : "text-lg"
                )}
            >
                {value}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{label}</p>
        </div>
    );
}
