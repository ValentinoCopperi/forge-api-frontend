import { useQuery } from "@tanstack/react-query";
import { customInstance } from "@/shared/api/axios/axios.mutator";
import type {
    CreateTaskPayload,
    TaskComment,
    TaskDetail,
    TaskFilters,
    TaskListItem,
    UpdateTaskPayload,
} from "../types/tasks.types";

type ArrayResponse<T> = { data: T[]; timestamp: string };
type ObjectResponse<T> = T & { timestamp: string };

export function listTasks(
    projectId: number,
    filters: TaskFilters = {},
    signal?: AbortSignal
) {
    return customInstance<ArrayResponse<TaskListItem>>({
        url: "/tasks",
        method: "GET",
        params: { projectId, ...filters },
        signal,
    });
}

export function getTask(id: number, signal?: AbortSignal) {
    return customInstance<ObjectResponse<TaskDetail>>({
        url: `/tasks/${id}`,
        method: "GET",
        signal,
    });
}

export function createTask(data: CreateTaskPayload) {
    return customInstance<ObjectResponse<TaskDetail>>({
        url: "/tasks",
        method: "POST",
        data,
    });
}

export function updateTask(id: number, data: UpdateTaskPayload) {
    return customInstance<ObjectResponse<TaskDetail>>({
        url: `/tasks/${id}`,
        method: "PATCH",
        data,
    });
}

export function deleteTask(id: number) {
    return customInstance<void>({
        url: `/tasks/${id}`,
        method: "DELETE",
    });
}

export function listTaskComments(taskId: number, signal?: AbortSignal) {
    return customInstance<ArrayResponse<TaskComment>>({
        url: `/tasks/${taskId}/comments`,
        method: "GET",
        signal,
    });
}

export function createTaskComment(taskId: number, content: string) {
    return customInstance<ObjectResponse<TaskComment>>({
        url: `/tasks/${taskId}/comments`,
        method: "POST",
        data: { content },
    });
}

export function deleteTaskComment(taskId: number, commentId: number) {
    return customInstance<void>({
        url: `/tasks/${taskId}/comments/${commentId}`,
        method: "DELETE",
    });
}

export const tasksListQueryKey = (
    projectId: number | undefined,
    filters: TaskFilters = {}
) => ["tasks", "list", projectId, filters] as const;

export const taskQueryKey = (id: number | undefined) =>
    ["tasks", "detail", id] as const;

export const taskCommentsQueryKey = (taskId: number | undefined) =>
    ["tasks", "comments", taskId] as const;

export function useTasksList(
    projectId: number | undefined,
    filters: TaskFilters = {}
) {
    return useQuery({
        queryKey: tasksListQueryKey(projectId, filters),
        queryFn: ({ signal }) =>
            listTasks(projectId as number, filters, signal),
        enabled: projectId != null && !Number.isNaN(projectId),
    });
}

export function useTask(id: number | undefined) {
    return useQuery({
        queryKey: taskQueryKey(id),
        queryFn: ({ signal }) => getTask(id as number, signal),
        enabled: id != null && !Number.isNaN(id),
    });
}

export function useTaskComments(taskId: number | undefined) {
    return useQuery({
        queryKey: taskCommentsQueryKey(taskId),
        queryFn: ({ signal }) => listTaskComments(taskId as number, signal),
        enabled: taskId != null && !Number.isNaN(taskId),
    });
}
