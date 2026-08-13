import { ArrowLeft, Calendar, FolderKanban, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { pathBuilder } from "@/shared/config/routes";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { cn } from "@/shared/utils/utils";
import {
    formatDashboardDate,
    getProjectStatusTone,
    PROJECT_STATUS_LABELS,
} from "@/features/dashboard/utils/dashboard.utils";
import type { ProjectDetail } from "../types/projects.types";

type ProjectHeroProps = {
    project: ProjectDetail;
    canManage: boolean;
    onEdit: () => void;
    onDelete: () => void;
};

export function ProjectHero({
    project,
    canManage,
    onEdit,
    onDelete,
}: ProjectHeroProps) {
    const manager = project.User_Project_managerIdToUser;
    const managerAvatarSrc = getAvatarSrc(manager.avatarUrl);
    const statusStyle = getProjectStatusTone(project.status);

    return (
        <header className="dashboard-card-surface p-6 sm:p-8">
            <Button asChild variant="outline" size="sm" className="mb-4">
                <Link to={pathBuilder.orgProjects(project.organizationId)}>
                    <ArrowLeft className="size-4" />
                    Projects
                </Link>
            </Button>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="eyebrow">
                            <FolderKanban className="size-3" />
                            {project.Organization.name}
                        </span>
                        <span
                            className={cn(
                                "inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                                statusStyle
                            )}
                        >
                            {PROJECT_STATUS_LABELS[project.status]}
                        </span>
                    </div>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        {project.name}
                    </h1>
                    {project.description ? (
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                            {project.description}
                        </p>
                    ) : (
                        <p className="mt-3 text-sm italic text-muted-foreground/50">
                            No description provided.
                        </p>
                    )}
                </div>

                {canManage ? (
                    <div className="flex shrink-0 gap-2">
                        <Button variant="outline" size="sm" onClick={onEdit}>
                            <Pencil className="size-4" />
                            Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={onDelete}>
                            <Trash2 className="size-4" />
                            Delete
                        </Button>
                    </div>
                ) : null}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                    to={pathBuilder.userProfile(manager.id)}
                    className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs transition-colors hover:bg-muted/60"
                >
                    <Avatar className="size-6 border border-border">
                        {managerAvatarSrc ? (
                            <AvatarImage src={managerAvatarSrc} alt={manager.name} />
                        ) : null}
                        <AvatarFallback className="bg-muted text-[9px] font-bold text-muted-foreground">
                            {getInitials(manager.name)}
                        </AvatarFallback>
                    </Avatar>
                    <span>
                        <span className="font-semibold text-foreground">
                            {manager.name}
                        </span>
                        <span className="ml-1 text-muted-foreground">· manager</span>
                    </span>
                </Link>

                <span className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                    <Calendar className="size-3.5 shrink-0" />
                    <span>
                        Created{" "}
                        <span className="font-medium text-foreground">
                            {formatDashboardDate(project.createdAt)}
                        </span>
                    </span>
                </span>

                <span className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                        {project._count.Task}
                    </span>
                    {project._count.Task === 1 ? "task" : "tasks"}
                </span>
            </div>
        </header>
    );
}
