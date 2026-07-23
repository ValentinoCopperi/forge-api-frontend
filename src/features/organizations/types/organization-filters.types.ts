import type { OrganizationsGetAllByUserResponseDtoRole } from "@/shared/api/generated";

export type OrganizationRoleFilter =
    | OrganizationsGetAllByUserResponseDtoRole
    | "NOT_MEMBER";

export type OrganizationFilterUser = {
    id: number;
    name: string;
    email: string;
    avatarUrl: string | null;
    organizationCount: number;
};

export type OrganizationFilters = {
    roles: OrganizationRoleFilter[];
    creatorIds: number[];
    createdFrom: string;
    createdTo: string;
    updatedFrom: string;
    updatedTo: string;
    membersMin: string;
    membersMax: string;
    projectsMin: string;
    projectsMax: string;
};

export const DEFAULT_ORGANIZATION_FILTERS: OrganizationFilters = {
    roles: [],
    creatorIds: [],
    createdFrom: "",
    createdTo: "",
    updatedFrom: "",
    updatedTo: "",
    membersMin: "",
    membersMax: "",
    projectsMin: "",
    projectsMax: "",
};

export const ORGANIZATION_ROLE_FILTER_OPTIONS: {
    value: OrganizationRoleFilter;
    label: string;
}[] = [
    { value: "OWNER", label: "Owner" },
    { value: "ADMIN", label: "Admin" },
    { value: "MEMBER", label: "Member" },
    { value: "VIEWER", label: "Viewer" },
    { value: "NOT_MEMBER", label: "Not a member" },
];
