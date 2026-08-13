import { useState } from "react";
import {
    createProject,
    deleteProject,
    getProject,
    listProjects,
    updateProject,
} from "@/features/projects/api/projects.api";
import type { ProjectStatus } from "@/features/projects/types/projects.types";
import { API_PREFIX } from "@/shared/config/envs/env";
import { DashboardSectionHeader } from "@/features/dashboard/components/dashboard-card";
import { Label } from "@/shared/ui/label";
import { FieldInput } from "@/features/auth/components/FieldInput";
import { TutorialEndpointCard } from "./tutorial-endpoint-card";

const PROJECTS_PREFIX = `${API_PREFIX}/projects`;

const STATUS_OPTIONS: ProjectStatus[] = [
    "ACTIVE",
    "INACTIVE",
    "ARCHIVED",
    "DELETED",
    "PAUSED",
    "CANCELLED",
    "COMPLETED",
];

export function TutorialProjectsSection() {
    const [organizationId, setOrganizationId] = useState("1");
    const [managerId, setManagerId] = useState("1");
    const [name, setName] = useState("Forge Demo Project");
    const [description, setDescription] = useState(
        "Project created from the tutorial page."
    );
    const [projectId, setProjectId] = useState("1");
    const [updateName, setUpdateName] = useState("");
    const [status, setStatus] = useState<ProjectStatus>("ACTIVE");

    const parsedOrganizationId = Number(organizationId);
    const parsedManagerId = Number(managerId);
    const parsedProjectId = Number(projectId);

    return (
        <section className="space-y-5">
            <DashboardSectionHeader
                title="Projects"
                description="Projects belong to an organization and are always assigned a manager. Create/update/delete actions require organization-level permissions (OWNER, ADMIN, or MEMBER for create/delete; OWNER/ADMIN or the assigned manager for updates)."
            />

            <div className="grid gap-5 xl:grid-cols-2">
                <TutorialEndpointCard
                    method="POST"
                    path={PROJECTS_PREFIX}
                    title="Create project"
                    description="Creates a project inside an organization and assigns a manager."
                    onRun={() => {
                        if (!parsedOrganizationId || !parsedManagerId) {
                            throw new Error(
                                "Enter a valid organization id and manager id."
                            );
                        }

                        return createProject({
                            name,
                            description: description || undefined,
                            organizationId: parsedOrganizationId,
                            managerId: parsedManagerId,
                        });
                    }}
                >
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="create-project-org-id">
                                Organization id
                            </Label>
                            <FieldInput
                                id="create-project-org-id"
                                type="number"
                                min={1}
                                value={organizationId}
                                onChange={(event) =>
                                    setOrganizationId(event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="create-project-manager-id">
                                Manager user id
                            </Label>
                            <FieldInput
                                id="create-project-manager-id"
                                type="number"
                                min={1}
                                value={managerId}
                                onChange={(event) =>
                                    setManagerId(event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="create-project-name">Name</Label>
                            <FieldInput
                                id="create-project-name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="create-project-description">
                                Description
                            </Label>
                            <FieldInput
                                id="create-project-description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                            />
                        </div>
                    </div>
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="GET"
                    path={`${PROJECTS_PREFIX}?organizationId=`}
                    title="List projects"
                    description="Returns every project in an organization."
                    onRun={() => {
                        if (!parsedOrganizationId) {
                            throw new Error("Enter a valid organization id.");
                        }

                        return listProjects(parsedOrganizationId);
                    }}
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="list-projects-org-id">
                            Organization id
                        </Label>
                        <FieldInput
                            id="list-projects-org-id"
                            type="number"
                            min={1}
                            value={organizationId}
                            onChange={(event) =>
                                setOrganizationId(event.target.value)
                            }
                        />
                    </div>
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="GET"
                    path={`${PROJECTS_PREFIX}/:id`}
                    title="Project detail"
                    description="Fetches a single project with manager, creator, organization, and task count."
                    onRun={() => {
                        if (!parsedProjectId) {
                            throw new Error("Enter a valid project id.");
                        }

                        return getProject(parsedProjectId);
                    }}
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="project-id">Project id</Label>
                        <FieldInput
                            id="project-id"
                            type="number"
                            min={1}
                            value={projectId}
                            onChange={(event) => setProjectId(event.target.value)}
                        />
                    </div>
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="PATCH"
                    path={`${PROJECTS_PREFIX}/:id`}
                    title="Update project"
                    description="Updates name, description, manager, or status. Requires update permission or being the project's manager."
                    onRun={() => {
                        if (!parsedProjectId) {
                            throw new Error("Enter a valid project id.");
                        }

                        return updateProject(parsedProjectId, {
                            name: updateName || undefined,
                            status,
                        });
                    }}
                >
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="update-project-id">Project id</Label>
                            <FieldInput
                                id="update-project-id"
                                type="number"
                                min={1}
                                value={projectId}
                                onChange={(event) =>
                                    setProjectId(event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="update-project-name">New name</Label>
                            <FieldInput
                                id="update-project-name"
                                placeholder="Optional"
                                value={updateName}
                                onChange={(event) =>
                                    setUpdateName(event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="update-project-status">Status</Label>
                            <select
                                id="update-project-status"
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value as ProjectStatus)
                                }
                                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="DELETE"
                    path={`${PROJECTS_PREFIX}/:id`}
                    title="Delete project"
                    description="Permanently deletes the project and cascades its tasks."
                    note="Use a test project id. This action cannot be undone."
                    destructive
                    runLabel="Delete project"
                    onRun={() => {
                        if (!parsedProjectId) {
                            throw new Error("Enter a valid project id.");
                        }

                        return deleteProject(parsedProjectId);
                    }}
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="delete-project-id">Project id</Label>
                        <FieldInput
                            id="delete-project-id"
                            type="number"
                            min={1}
                            value={projectId}
                            onChange={(event) => setProjectId(event.target.value)}
                        />
                    </div>
                </TutorialEndpointCard>
            </div>
        </section>
    );
}
