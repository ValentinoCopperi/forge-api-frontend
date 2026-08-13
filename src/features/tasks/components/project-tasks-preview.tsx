import { Link } from "react-router-dom";
import { ExternalLink, ListTodo } from "lucide-react";
import { DashboardCard, DashboardSectionHeader } from "@/features/dashboard";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { pathBuilder } from "@/shared/config/routes";
import { cn } from "@/shared/utils/utils";
import { useTasksList } from "../api/tasks.api";
import {
    getTaskStatusTone,
    TASK_STATUS_LABELS,
} from "../utils/tasks.utils";

type ProjectTasksPreviewProps = {
    orgId: number;
    projectId: number;
};

export function ProjectTasksPreview({
    orgId,
    projectId,
}: ProjectTasksPreviewProps) {
    const tasksQuery = useTasksList(projectId);
    const tasks = (tasksQuery.data?.data ?? []).slice(0, 5);

    return (
        <DashboardCard>
            <DashboardSectionHeader
                title="Tasks"
                description="Recent tasks in this project"
                action={
                    <Button asChild variant="outline" size="sm">
                        <Link to={pathBuilder.orgProjectTasks(orgId, projectId)}>
                            <ListTodo className="size-4" />
                            View all
                        </Link>
                    </Button>
                }
            />

            {tasksQuery.isLoading ? (
                <div className="mt-6 space-y-3">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : tasks.length > 0 ? (
                <div className="mt-6 space-y-2.5">
                    {tasks.map((task) => (
                        <Link
                            key={task.id}
                            to={pathBuilder.orgProjectTaskId(
                                orgId,
                                projectId,
                                task.id
                            )}
                            className="group flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-2.5 transition-all hover:border-primary/25 hover:bg-primary/5"
                        >
                            <span className="min-w-0 truncate text-sm font-medium text-foreground group-hover:text-primary">
                                {task.title}
                            </span>
                            <span
                                className={cn(
                                    "inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                                    getTaskStatusTone(task.status)
                                )}
                            >
                                {TASK_STATUS_LABELS[task.status]}
                            </span>
                            <ExternalLink className="size-3.5 shrink-0 text-transparent transition-colors group-hover:text-muted-foreground" />
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-6 py-10 text-center">
                    <ListTodo className="mx-auto size-8 text-muted-foreground/40" />
                    <p className="mt-3 text-sm font-medium text-muted-foreground">
                        No tasks yet.
                    </p>
                </div>
            )}
        </DashboardCard>
    );
}
