import { useState } from "react";
import { useParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { useOrganizationsControllerFindOne } from "@/shared/api/generated";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { DashboardCard, DashboardShell } from "@/features/dashboard";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import {
    DeleteTaskDialog,
    EditTaskDialog,
    TaskCommentsSection,
    TaskHero,
    useTask,
} from "@/features/tasks";

export default function TaskPage() {
    const { orgId, projectId, taskId } = useParams<{
        orgId: string;
        projectId: string;
        taskId: string;
    }>();
    const organizationId = Number(orgId);
    const projectIdNum = Number(projectId);
    const id = Number(taskId);

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const user = useAuthStore((state) => state.user);
    const taskQuery = useTask(id);
    const orgQuery = useOrganizationsControllerFindOne(organizationId);

    const task = taskQuery.data;
    const members = orgQuery.data?.OrganizationUser ?? [];
    const myMembership = members.find((member) => member.User.id === user?.id);
    const canManage = myMembership ? myMembership.role !== "VIEWER" : false;
    const canModerate =
        myMembership?.role === "OWNER" || myMembership?.role === "ADMIN";

    if (taskQuery.isLoading) {
        return (
            <DashboardShell>
                <DashboardCard>
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="mt-4 h-40 w-full" />
                </DashboardCard>
            </DashboardShell>
        );
    }

    if (taskQuery.isError || !task) {
        return (
            <DashboardShell>
                <DashboardCard>
                    <p className="text-sm font-medium text-muted-foreground">
                        Could not load this task.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => void taskQuery.refetch()}
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
            <TaskHero
                orgId={organizationId}
                projectId={projectIdNum}
                task={task}
                canManage={canManage}
                onEdit={() => setEditOpen(true)}
                onDelete={() => setDeleteOpen(true)}
            />

            <TaskCommentsSection
                taskId={id}
                currentUserId={user?.id}
                canModerate={canModerate}
            />

            <EditTaskDialog
                task={editOpen ? task : null}
                onClose={() => setEditOpen(false)}
                projectId={projectIdNum}
                members={members}
            />
            <DeleteTaskDialog
                task={deleteOpen ? task : null}
                onClose={() => setDeleteOpen(false)}
                projectId={projectIdNum}
            />
        </DashboardShell>
    );
}
