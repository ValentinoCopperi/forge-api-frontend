import type { AddUserToOrganizationDtoRole } from "@/shared/api/generated";

export type RoleOption = {
    value: AddUserToOrganizationDtoRole;
    label: string;
    description: string;
};

export const ROLE_OPTIONS: RoleOption[] = [
    { value: "OWNER", label: "Owner", description: "Full control over the organization" },
    { value: "ADMIN", label: "Admin", description: "Manage members and projects" },
    { value: "MEMBER", label: "Member", description: "Contribute to projects" },
    { value: "VIEWER", label: "Viewer", description: "Read-only access" },
];
