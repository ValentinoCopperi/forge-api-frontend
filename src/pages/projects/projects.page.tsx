import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import { useOrganizationsControllerFindOne } from "@/shared/api/generated";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { DashboardCard, DashboardSectionHeader, DashboardShell } from "@/features/dashboard";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import {
    CreateProjectDialog,
    DeleteProjectDialog,
    EditProjectDialog,
    ProjectsTable,
    useProjectsList,
} from "@/features/projects";
import type { ProjectListItem } from "@/features/projects";

export default function ProjectsPage() {
    const { orgId } = useParams<{ orgId: string }>();
    const organizationId = Number(orgId);

    const [search, setSearch] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [editProject, setEditProject] = useState<ProjectListItem | null>(null);
    const [deleteProject, setDeleteProject] = useState<ProjectListItem | null>(
        null
    );

    const user = useAuthStore((state) => state.user);

    const orgQuery = useOrganizationsControllerFindOne(organizationId);
    const projectsQuery = useProjectsList(organizationId);

    const org = orgQuery.data;
    const members = org?.OrganizationUser ?? [];
    const projects = projectsQuery.data?.data ?? [];

    const myMembership = members.find((member) => member.User.id === user?.id);
    const canManage = myMembership ? myMembership.role !== "VIEWER" : false;

    const filteredProjects = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return projects;
        return projects.filter((project) =>
            project.name.toLowerCase().includes(query)
        );
    }, [projects, search]);

    const isLoading = orgQuery.isLoading || projectsQuery.isLoading;
    const isRefreshing =
        (orgQuery.isFetching && !orgQuery.isLoading) ||
        (projectsQuery.isFetching && !projectsQuery.isLoading);

    const handleRefresh = () => {
        void Promise.all([orgQuery.refetch(), projectsQuery.refetch()]);
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

    if (orgQuery.isError || projectsQuery.isError || !org) {
        return (
            <DashboardShell>
                <DashboardCard>
                    <p className="text-sm font-medium text-muted-foreground">
                        Could not load projects.
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
                    title="Projects"
                    description={`${projects.length} ${projects.length === 1 ? "project" : "projects"} in ${org.name}`}
                    action={
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isRefreshing}
                                onClick={handleRefresh}
                            >
                                <RefreshCw
                                    className={isRefreshing ? "size-4 animate-spin" : "size-4"}
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
                                    New project
                                </Button>
                            ) : null}
                        </div>
                    }
                />

                <div className="mt-6">
                    <ProjectsTable
                        orgId={organizationId}
                        projects={filteredProjects}
                        totalCount={projects.length}
                        search={search}
                        onSearchChange={setSearch}
                        canManage={canManage}
                        onEdit={setEditProject}
                        onDelete={setDeleteProject}
                    />
                </div>
            </DashboardCard>

            <CreateProjectDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                organizationId={organizationId}
                members={members}
            />
            <EditProjectDialog
                project={editProject}
                onClose={() => setEditProject(null)}
                organizationId={organizationId}
                members={members}
            />
            <DeleteProjectDialog
                project={deleteProject}
                onClose={() => setDeleteProject(null)}
                organizationId={organizationId}
            />
        </DashboardShell>
    );
}
