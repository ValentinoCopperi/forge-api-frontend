import { useQuery } from "@tanstack/react-query";
import { customInstance } from "@/shared/api/axios/axios.mutator";
import { API_PREFIX } from "@/shared/config/envs/env";
import type {
    CreateProjectPayload,
    ProjectDetail,
    ProjectListItem,
    UpdateProjectPayload,
} from "../types/projects.types";

type ArrayResponse<T> = { data: T[]; timestamp: string };
type ObjectResponse<T> = T & { timestamp: string };

export function listProjects(organizationId: number, signal?: AbortSignal) {
    return customInstance<ArrayResponse<ProjectListItem>>({
        url: `${API_PREFIX}/projects`,
        method: "GET",
        params: { organizationId },
        signal,
    });
}

export function getProject(id: number, signal?: AbortSignal) {
    return customInstance<ObjectResponse<ProjectDetail>>({
        url: `${API_PREFIX}/projects/${id}`,
        method: "GET",
        signal,
    });
}

export function createProject(data: CreateProjectPayload) {
    return customInstance<ObjectResponse<ProjectDetail>>({
        url: `${API_PREFIX}/projects`,
        method: "POST",
        data,
    });
}

export function updateProject(id: number, data: UpdateProjectPayload) {
    return customInstance<ObjectResponse<ProjectDetail>>({
        url: `${API_PREFIX}/projects/${id}`,
        method: "PATCH",
        data,
    });
}

export function deleteProject(id: number) {
    return customInstance<void>({
        url: `${API_PREFIX}/projects/${id}`,
        method: "DELETE",
    });
}

export const projectsListQueryKey = (organizationId: number | undefined) =>
    ["projects", "list", organizationId] as const;

export const projectQueryKey = (id: number | undefined) =>
    ["projects", "detail", id] as const;

export function useProjectsList(organizationId: number | undefined) {
    return useQuery({
        queryKey: projectsListQueryKey(organizationId),
        queryFn: ({ signal }) => listProjects(organizationId as number, signal),
        enabled: organizationId != null && !Number.isNaN(organizationId),
    });
}

export function useProject(id: number | undefined) {
    return useQuery({
        queryKey: projectQueryKey(id),
        queryFn: ({ signal }) => getProject(id as number, signal),
        enabled: id != null && !Number.isNaN(id),
    });
}
