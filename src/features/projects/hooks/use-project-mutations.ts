import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    createProject,
    deleteProject,
    projectQueryKey,
    projectsListQueryKey,
    updateProject,
} from "../api/projects.api";
import type {
    CreateProjectPayload,
    UpdateProjectPayload,
} from "../types/projects.types";

export function useProjectMutations(organizationId: number | undefined) {
    const queryClient = useQueryClient();

    const invalidateList = () => {
        void queryClient.invalidateQueries({
            queryKey: projectsListQueryKey(organizationId),
        });
    };

    const createMutation = useMutation({
        mutationFn: (data: CreateProjectPayload) => createProject(data),
        onSuccess: () => {
            toast.success("Project created");
            invalidateList();
        },
        onError: () => {
            toast.error("Could not create project", {
                description: "Verify your permissions and try again.",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateProjectPayload }) =>
            updateProject(id, data),
        onSuccess: (_result, variables) => {
            toast.success("Project updated");
            invalidateList();
            void queryClient.invalidateQueries({
                queryKey: projectQueryKey(variables.id),
            });
        },
        onError: () => {
            toast.error("Could not update project", {
                description: "Check your permissions and try again.",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteProject(id),
        onSuccess: () => {
            toast.success("Project deleted");
            invalidateList();
        },
        onError: () => {
            toast.error("Could not delete project", {
                description: "Check your permissions and try again.",
            });
        },
    });

    return { createMutation, updateMutation, deleteMutation };
}
