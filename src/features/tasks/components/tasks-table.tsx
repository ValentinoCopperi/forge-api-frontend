import { Link } from "react-router-dom";
import {
    Calendar,
    ExternalLink,
    ListTodo,
    MoreHorizontal,
    Pencil,
    Trash2,
} from "lucide-react";
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
import {
    formatTaskDate,
    getTaskPriorityTone,
    getTaskStatusTone,
    TASK_CATEGORY_LABELS,
    TASK_PRIORITY_LABELS,
    TASK_STATUS_LABELS,
} from "../utils/tasks.utils";
import type { TaskListItem } from "../types/tasks.types";

type TasksTableProps = {
    orgId: number;
    projectId: number;
    tasks: TaskListItem[];
    totalCount: number;
    canManage: boolean;
    onEdit: (task: TaskListItem) => void;
    onDelete: (task: TaskListItem) => void;
};

export function TasksTable({
    orgId,
    projectId,
    tasks,
    totalCount,
    canManage,
    onEdit,
    onDelete,
}: TasksTableProps) {
    const noDataAtAll = totalCount === 0;
    const noMatches = !noDataAtAll && tasks.length === 0;

    if (noDataAtAll || noMatches) {
        return (
            <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-6 py-14 text-center">
                <ListTodo className="mx-auto size-8 text-muted-foreground/40" />
                <p className="mt-3 text-sm font-medium text-foreground">
                    {noDataAtAll
                        ? "No tasks yet."
                        : "No tasks match the current filters."}
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left">
                <thead>
                    <tr className="border-b border-primary/10 dashboard-table-head">
                        <TableHead>Task</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <TaskRow
                            key={task.id}
                            orgId={orgId}
                            projectId={projectId}
                            task={task}
                            canManage={canManage}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </tbody>
            </table>
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

function TaskRow({
    orgId,
    projectId,
    task,
    canManage,
    onEdit,
    onDelete,
}: {
    orgId: number;
    projectId: number;
    task: TaskListItem;
    canManage: boolean;
    onEdit: (task: TaskListItem) => void;
    onDelete: (task: TaskListItem) => void;
}) {
    const assignee = task.User_Task_designatedToToUser;
    const assigneeAvatarSrc = getAvatarSrc(assignee?.avatarUrl);

    return (
        <tr className="border-b border-border/60 text-sm transition-colors hover:bg-muted/30">
            <td className="px-5 py-3.5">
                <Link
                    to={pathBuilder.orgProjectTaskId(orgId, projectId, task.id)}
                    className="group flex items-center gap-2 font-semibold text-foreground hover:text-primary"
                >
                    {task.title}
                    <ExternalLink className="size-3.5 text-transparent transition-colors group-hover:text-muted-foreground" />
                </Link>
            </td>
            <td className="px-5 py-3.5">
                <span
                    className={cn(
                        "inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                        getTaskStatusTone(task.status)
                    )}
                >
                    {TASK_STATUS_LABELS[task.status]}
                </span>
            </td>
            <td className="px-5 py-3.5">
                <span
                    className={cn(
                        "inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                        getTaskPriorityTone(task.priority)
                    )}
                >
                    {TASK_PRIORITY_LABELS[task.priority]}
                </span>
            </td>
            <td className="px-5 py-3.5 text-xs text-muted-foreground">
                {TASK_CATEGORY_LABELS[task.category]}
            </td>
            <td className="px-5 py-3.5">
                {assignee ? (
                    <Link
                        to={pathBuilder.userProfile(assignee.id)}
                        className="flex items-center gap-2 hover:text-primary"
                    >
                        <Avatar className="size-6 border border-border">
                            {assigneeAvatarSrc ? (
                                <AvatarImage
                                    src={assigneeAvatarSrc}
                                    alt={assignee.name}
                                />
                            ) : null}
                            <AvatarFallback className="bg-muted text-[9px] font-semibold text-muted-foreground">
                                {getInitials(assignee.name)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{assignee.name}</span>
                    </Link>
                ) : (
                    <span className="text-xs italic text-muted-foreground/50">
                        Unassigned
                    </span>
                )}
            </td>
            <td className="px-5 py-3.5">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3.5" />
                    {formatTaskDate(task.deadline)}
                </span>
            </td>
            <td className="px-5 py-3.5 text-right">
                {canManage ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                            <MoreHorizontal className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => onEdit(task)}>
                                <Pencil className="size-4" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => onDelete(task)}
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
