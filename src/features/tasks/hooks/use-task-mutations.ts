import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTask, deleteTask, taskQueryKey, updateTask } from "../api/tasks.api";
import type { CreateTaskPayload, UpdateTaskPayload } from "../types/tasks.types";

export function useTaskMutations(projectId: number | undefined) {
    const queryClient = useQueryClient();

    const invalidateList = () => {
        void queryClient.invalidateQueries({
            queryKey: ["tasks", "list", projectId],
        });
    };

    const createMutation = useMutation({
        mutationFn: (data: CreateTaskPayload) => createTask(data),
        onSuccess: () => {
            toast.success("Task created");
            invalidateList();
        },
        onError: () => {
            toast.error("Could not create task", {
                description: "Verify your permissions and try again.",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: UpdateTaskPayload }) =>
            updateTask(id, data),
        onSuccess: (_result, variables) => {
            toast.success("Task updated");
            invalidateList();
            void queryClient.invalidateQueries({
                queryKey: taskQueryKey(variables.id),
            });
        },
        onError: () => {
            toast.error("Could not update task", {
                description: "Check your permissions and try again.",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteTask(id),
        onSuccess: () => {
            toast.success("Task deleted");
            invalidateList();
        },
        onError: () => {
            toast.error("Could not delete task", {
                description: "Check your permissions and try again.",
            });
        },
    });

    return { createMutation, updateMutation, deleteMutation };
}
