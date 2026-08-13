import { Link } from "react-router-dom";
import {
    Calendar,
    CheckSquare,
    ExternalLink,
    FolderKanban,
    MoreHorizontal,
    Pencil,
    Search,
    Trash2,
} from "lucide-react";
import { FieldInput } from "@/features/auth/components/FieldInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { pathBuilder } from "@/shared/config/routes";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { cn } from "@/shared/utils/utils";
import { formatDashboardDate } from "@/features/dashboard/utils/dashboard.utils";
import {
    getProjectStatusTone,
    PROJECT_STATUS_LABELS,
} from "@/features/dashboard/utils/dashboard.utils";
import type { ProjectListItem } from "../types/projects.types";

type ProjectsTableProps = {
    orgId: number;
    projects: ProjectListItem[];
    totalCount: number;
    search: string;
    onSearchChange: (value: string) => void;
    canManage: boolean;
    onEdit: (project: ProjectListItem) => void;
    onDelete: (project: ProjectListItem) => void;
};

export function ProjectsTable({
    orgId,
    projects,
    totalCount,
    search,
    onSearchChange,
    canManage,
    onEdit,
    onDelete,
}: ProjectsTableProps) {
    const noDataAtAll = totalCount === 0;
    const noMatches = !noDataAtAll && projects.length === 0;

    return (
        <div className="space-y-4">
            <div className="max-w-sm">
                <FieldInput
                    icon={Search}
                    placeholder="Search projects by name..."
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    aria-label="Search projects"
                />
            </div>

            {noDataAtAll || noMatches ? (
                <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-6 py-14 text-center">
                    <FolderKanban className="mx-auto size-8 text-muted-foreground/40" />
                    <p className="mt-3 text-sm font-medium text-foreground">
                        {noDataAtAll
                            ? "No projects yet."
                            : "No projects match your search."}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-primary/10 dashboard-table-head">
                                <TableHead>Project</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Manager</TableHead>
                                <TableHead className="text-center">Tasks</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <ProjectRow
                                    key={project.id}
                                    orgId={orgId}
                                    project={project}
                                    canManage={canManage}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function TableHead({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <th
            className={cn(
                "px-5 py-3.5 text-[11px] font-bold tracking-wider uppercase",
                className
            )}
        >
            {children}
        </th>
    );
}

function ProjectRow({
    orgId,
    project,
    canManage,
    onEdit,
    onDelete,
}: {
    orgId: number;
    project: ProjectListItem;
    canManage: boolean;
    onEdit: (project: ProjectListItem) => void;
    onDelete: (project: ProjectListItem) => void;
}) {
    const manager = project.User_Project_managerIdToUser;
    const managerAvatarSrc = getAvatarSrc(manager.avatarUrl);
    const statusStyle = getProjectStatusTone(project.status);

    return (
        <tr className="border-b border-border/60 text-sm transition-colors hover:bg-muted/30">
            <td className="px-5 py-3.5">
                <Link
                    to={pathBuilder.orgProjectId(orgId, project.id)}
                    className="group flex items-center gap-2 font-semibold text-foreground hover:text-primary"
                >
                    {project.name}
                    <ExternalLink className="size-3.5 text-transparent transition-colors group-hover:text-muted-foreground" />
                </Link>
                {project.description ? (
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {project.description}
                    </p>
                ) : null}
            </td>
            <td className="px-5 py-3.5">
                <span
                    className={cn(
                        "inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                        statusStyle
                    )}
                >
                    {PROJECT_STATUS_LABELS[project.status]}
                </span>
            </td>
            <td className="px-5 py-3.5">
                <Link
                    to={pathBuilder.userProfile(manager.id)}
                    className="flex items-center gap-2 hover:text-primary"
                >
                    <Avatar className="size-6 border border-border">
                        {managerAvatarSrc ? (
                            <AvatarImage src={managerAvatarSrc} alt={manager.name} />
                        ) : null}
                        <AvatarFallback className="bg-muted text-[9px] font-semibold text-muted-foreground">
                            {getInitials(manager.name)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{manager.name}</span>
                </Link>
            </td>
            <td className="px-5 py-3.5 text-center">
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CheckSquare className="size-3.5" />
                    {project._count.Task}
                </span>
            </td>
            <td className="px-5 py-3.5">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    {formatDashboardDate(project.createdAt)}
                </span>
            </td>
            <td className="px-5 py-3.5 text-right">
                {canManage ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                            <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => onEdit(project)}>
                                <Pencil className="size-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => onDelete(project)}
                            >
                                <Trash2 className="size-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : null}
            </td>
        </tr>
    );
}
