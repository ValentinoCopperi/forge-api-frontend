import { ExternalLink, FolderKanban } from "lucide-react";
import { Link } from "react-router-dom";
import type {
    OrganizationProjectResponseDto,
    OrganizationProjectResponseDtoStatus,
} from "@/shared/api/generated";
import { DashboardCard, DashboardSectionHeader } from "@/features/dashboard";
import {
    getProjectStatusTone,
    PROJECT_STATUS_LABELS,
} from "@/features/dashboard/utils/dashboard.utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { pathBuilder } from "@/shared/config/routes";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { cn } from "@/shared/utils/utils";
import { formatOrganizationDate } from "@/features/organizations/utils/organizations.utils";

type ProjectRowProps = {
    project: OrganizationProjectResponseDto;
    orgId: number;
};

function ProjectRow({ project, orgId }: ProjectRowProps) {
    const manager = project.User_Project_managerIdToUser;
    const managerAvatarSrc = getAvatarSrc(manager.avatarUrl);
    const statusStyle = getProjectStatusTone(
        project.status as OrganizationProjectResponseDtoStatus
    );

    return (
        <Link
            to={pathBuilder.orgProjectId(orgId, project.id)}
            className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-muted/20 p-4 transition-all hover:border-primary/25 hover:bg-primary/5 hover:shadow-sm"
        >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                <FolderKanban className="size-5" />
            </span>

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                        {project.name}
                    </p>
                    <span
                        className={cn(
                            "inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                            statusStyle
                        )}
                    >
                        {PROJECT_STATUS_LABELS[project.status]}
                    </span>
                </div>
                {project.description ? (
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {project.description}
                    </p>
                ) : (
                    <p className="mt-0.5 text-xs italic text-muted-foreground/50">
                        No description
                    </p>
                )}
                <p className="mt-1 font-mono text-[10px] text-muted-foreground/60">
                    ID #{project.id} · Created{" "}
                    {formatOrganizationDate(project.createdAt)}
                </p>
            </div>

            <div className="hidden shrink-0 items-center gap-2.5 sm:flex">
                <Avatar className="size-8 border border-border">
                    {managerAvatarSrc ? (
                        <AvatarImage
                            src={managerAvatarSrc}
                            alt={manager.name}
                        />
                    ) : null}
                    <AvatarFallback className="bg-muted text-[10px] font-semibold text-muted-foreground">
                        {getInitials(manager.name)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-xs font-medium text-foreground">
                        {manager.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Manager</p>
                </div>
            </div>

            <ExternalLink className="size-4 shrink-0 text-transparent transition-colors group-hover:text-muted-foreground" />
        </Link>
    );
}

type ProjectsSectionProps = {
    projects: OrganizationProjectResponseDto[];
    orgId: number;
};

export function ProjectsSection({ projects, orgId }: ProjectsSectionProps) {
    return (
        <DashboardCard>
            <DashboardSectionHeader
                title="Projects"
                description={`${projects.length} ${projects.length === 1 ? "project" : "projects"} in this organization`}
                action={
                    <Button asChild variant="outline" size="sm">
                        <Link to={pathBuilder.orgProjects(orgId)}>
                            <FolderKanban className="size-4" />
                            View all
                        </Link>
                    </Button>
                }
            />
            {projects.length > 0 ? (
                <div className="mt-6 space-y-3">
                    {projects.map((project) => (
                        <ProjectRow
                            key={project.id}
                            project={project}
                            orgId={orgId}
                        />
                    ))}
                </div>
            ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-6 py-10 text-center">
                    <FolderKanban className="mx-auto size-8 text-muted-foreground/40" />
                    <p className="mt-3 text-sm font-medium text-muted-foreground">
                        No projects yet.
                    </p>
                </div>
            )}
        </DashboardCard>
    );
}
