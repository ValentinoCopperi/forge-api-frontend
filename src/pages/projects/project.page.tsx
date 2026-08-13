import { useState } from "react";
import { useParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { DashboardCard, DashboardShell } from "@/features/dashboard";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import {
    DeleteProjectDialog,
    EditProjectDialog,
    ProjectHero,
    useProject,
} from "@/features/projects";
import { useOrganizationsControllerFindOne } from "@/shared/api/generated";
import { ProjectTasksPreview } from "@/features/tasks";

export default function ProjectPage() {
    const { orgId, projectId } = useParams<{ orgId: string; projectId: string }>();
    const organizationId = Number(orgId);
    const id = Number(projectId);

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const user = useAuthStore((state) => state.user);
    const projectQuery = useProject(id);
    const orgQuery = useOrganizationsControllerFindOne(organizationId);

    const project = projectQuery.data;
    const members = orgQuery.data?.OrganizationUser ?? [];
    const myMembership = members.find((member) => member.User.id === user?.id);
    const canManage =
        (myMembership && myMembership.role !== "VIEWER") ||
        project?.managerId === user?.id;

    if (projectQuery.isLoading) {
        return (
            <DashboardShell>
                <DashboardCard>
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="mt-4 h-40 w-full" />
                </DashboardCard>
            </DashboardShell>
        );
    }

    if (projectQuery.isError || !project) {
        return (
            <DashboardShell>
                <DashboardCard>
                    <p className="text-sm font-medium text-muted-foreground">
                        Could not load this project.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => void projectQuery.refetch()}
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
            <ProjectHero
                project={project}
                canManage={!!canManage}
                onEdit={() => setEditOpen(true)}
                onDelete={() => setDeleteOpen(true)}
            />

            <ProjectTasksPreview orgId={organizationId} projectId={id} />

            <EditProjectDialog
                project={editOpen ? project : null}
                onClose={() => setEditOpen(false)}
                organizationId={organizationId}
                members={members}
            />
            <DeleteProjectDialog
                project={deleteOpen ? project : null}
                onClose={() => setDeleteOpen(false)}
                organizationId={organizationId}
            />
        </DashboardShell>
    );
}
