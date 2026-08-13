import { useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import { useOrganizationsControllerFindOne } from "@/shared/api/generated";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { DashboardCard, DashboardSectionHeader, DashboardShell } from "@/features/dashboard";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { useProject } from "@/features/projects";
import {
    CreateTaskDialog,
    DeleteTaskDialog,
    EditTaskDialog,
    TaskFiltersBar,
    TasksTable,
    useTasksList,
} from "@/features/tasks";
import type { TaskCategory, TaskListItem, TaskPriority, TaskStatus } from "@/features/tasks";

export default function TasksPage() {
    const { orgId, projectId } = useParams<{ orgId: string; projectId: string }>();
    const organizationId = Number(orgId);
    const projectIdNum = Number(projectId);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<TaskStatus | "">("");
    const [priority, setPriority] = useState<TaskPriority | "">("");
    const [category, setCategory] = useState<TaskCategory | "">("");
    const [createOpen, setCreateOpen] = useState(false);
    const [editTask, setEditTask] = useState<TaskListItem | null>(null);
    const [deleteTask, setDeleteTask] = useState<TaskListItem | null>(null);

    const user = useAuthStore((state) => state.user);

    const orgQuery = useOrganizationsControllerFindOne(organizationId);
    const projectQuery = useProject(projectIdNum);
    const tasksQuery = useTasksList(projectIdNum, {
        status: status || undefined,
        priority: priority || undefined,
        category: category || undefined,
        search: search.trim() || undefined,
    });

    const org = orgQuery.data;
    const project = projectQuery.data;
    const members = org?.OrganizationUser ?? [];
    const tasks = tasksQuery.data?.data ?? [];

    const myMembership = members.find((member) => member.User.id === user?.id);
    const canManage =
        (myMembership && myMembership.role !== "VIEWER") ||
        project?.managerId === user?.id;

    const isLoading = orgQuery.isLoading || projectQuery.isLoading;

    const handleRefresh = () => {
        void Promise.all([
            orgQuery.refetch(),
            projectQuery.refetch(),
            tasksQuery.refetch(),
        ]);
    };

    if (isLoading) {
        return (
            <DashboardShell>
                <DashboardCard>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="mt-4 h-40 w-full" />
                </DashboardCard>
            </DashboardShell>
        );
    }

    if (orgQuery.isError || projectQuery.isError || !org || !project) {
        return (
            <DashboardShell>
                <DashboardCard>
                    <p className="text-sm font-medium text-muted-foreground">
                        Could not load tasks.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={handleRefresh}
                    >
                        <RefreshCw className="size-4" />
                        Retry
                    </Button>
                </DashboardCard>
            </DashboardShell>
        );
    }

    return (
        <DashboardShell>
            <DashboardCard>
                <DashboardSectionHeader
                    title="Tasks"
                    description={`${tasks.length} ${tasks.length === 1 ? "task" : "tasks"} in ${project.name}`}
                    action={
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={tasksQuery.isFetching}
                                onClick={handleRefresh}
                            >
                                <RefreshCw
                                    className={
                                        tasksQuery.isFetching
                                            ? "size-4 animate-spin"
                                            : "size-4"
                                    }
                                />
                                Refresh
                            </Button>
                            {canManage ? (
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => setCreateOpen(true)}
                                    className="shadow-md shadow-primary/20"
                                >
                                    <Plus className="size-4" />
                                    New task
                                </Button>
                            ) : null}
                        </div>
                    }
                />

                <div className="mt-6 space-y-4">
                    <TaskFiltersBar
                        search={search}
                        onSearchChange={setSearch}
                        status={status}
                        onStatusChange={setStatus}
                        priority={priority}
                        onPriorityChange={setPriority}
                        category={category}
                        onCategoryChange={setCategory}
                    />

                    <TasksTable
                        orgId={organizationId}
                        projectId={projectIdNum}
                        tasks={tasks}
                        totalCount={tasks.length}
                        canManage={!!canManage}
                        onEdit={setEditTask}
                        onDelete={setDeleteTask}
                    />
                </div>
            </DashboardCard>

            <CreateTaskDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                projectId={projectIdNum}
                members={members}
            />
            <EditTaskDialog
                task={editTask}
                onClose={() => setEditTask(null)}
                projectId={projectIdNum}
                members={members}
            />
            <DeleteTaskDialog
                task={deleteTask}
                onClose={() => setDeleteTask(null)}
                projectId={projectIdNum}
            />
        </DashboardShell>
    );
}
