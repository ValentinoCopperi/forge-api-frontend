import type { OrganizationProjectResponseDtoStatus } from "@/shared/api/generated";

export type ProjectStatus = OrganizationProjectResponseDtoStatus;

export type ProjectUserSummary = {
    id: number;
    name: string;
    email: string;
    avatarUrl: string | null;
};

export type ProjectListItem = {
    id: number;
    name: string;
    description: string | null;
    organizationId: number;
    managerId: number;
    status: ProjectStatus;
    createdAt: string;
    updatedAt: string;
    User_Project_managerIdToUser: ProjectUserSummary;
    User_Project_createdByUserIdToUser: ProjectUserSummary | null;
    _count: { Task: number };
};

export type ProjectDetail = ProjectListItem & {
    Organization: { id: number; name: string };
};

export type CreateProjectPayload = {
    name: string;
    description?: string;
    organizationId: number;
    managerId: number;
    status?: ProjectStatus;
};

export type UpdateProjectPayload = Partial<
    Omit<CreateProjectPayload, "organizationId">
>;
