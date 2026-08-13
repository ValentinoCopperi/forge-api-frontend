import { ArrowLeft, Calendar, ListTodo, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
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
import type { TaskDetail } from "../types/tasks.types";

type TaskHeroProps = {
    orgId: number;
    projectId: number;
    task: TaskDetail;
    canManage: boolean;
    onEdit: () => void;
    onDelete: () => void;
};

export function TaskHero({
    orgId,
    projectId,
    task,
    canManage,
    onEdit,
    onDelete,
}: TaskHeroProps) {
    const assignee = task.User_Task_designatedToToUser;
    const assigneeAvatarSrc = getAvatarSrc(assignee?.avatarUrl);

    return (
        <header className="dashboard-card-surface p-6 sm:p-8">
            <Button asChild variant="outline" size="sm" className="mb-4">
                <Link to={pathBuilder.orgProjectTasks(orgId, projectId)}>
                    <ArrowLeft className="size-4" />
                    Tasks
                </Link>
            </Button>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <span
                            className={cn(
                                "inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                                getTaskStatusTone(task.status)
                            )}
                        >
                            {TASK_STATUS_LABELS[task.status]}
                        </span>
                        <span
                            className={cn(
                                "inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                                getTaskPriorityTone(task.priority)
                            )}
                        >
                            {TASK_PRIORITY_LABELS[task.priority]} priority
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                            {TASK_CATEGORY_LABELS[task.category]}
                        </span>
                    </div>
                    <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        {task.title}
                    </h1>
                    {task.description ? (
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                            {task.description}
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
                {assignee ? (
                    <Link
                        to={pathBuilder.userProfile(assignee.id)}
                        className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs transition-colors hover:bg-muted/60"
                    >
                        <Avatar className="size-6 border border-border">
                            {assigneeAvatarSrc ? (
                                <AvatarImage
                                    src={assigneeAvatarSrc}
                                    alt={assignee.name}
                                />
                            ) : null}
                            <AvatarFallback className="bg-muted text-[9px] font-bold text-muted-foreground">
                                {getInitials(assignee.name)}
                            </AvatarFallback>
                        </Avatar>
                        <span>
                            <span className="font-semibold text-foreground">
                                {assignee.name}
                            </span>
                            <span className="ml-1 text-muted-foreground">
                                · assignee
                            </span>
                        </span>
                    </Link>
                ) : (
                    <span className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs italic text-muted-foreground/60">
                        <ListTodo className="size-3.5" />
                        Unassigned
                    </span>
                )}

                <span className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                    <Calendar className="size-3.5 shrink-0" />
                    <span>
                        Deadline{" "}
                        <span className="font-medium text-foreground">
                            {formatTaskDate(task.deadline)}
                        </span>
                    </span>
                </span>
            </div>
        </header>
    );
}
