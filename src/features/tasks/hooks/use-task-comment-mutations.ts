import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    createTaskComment,
    deleteTaskComment,
    taskCommentsQueryKey,
} from "../api/tasks.api";

export function useTaskCommentMutations(taskId: number | undefined) {
    const queryClient = useQueryClient();

    const invalidate = () => {
        void queryClient.invalidateQueries({
            queryKey: taskCommentsQueryKey(taskId),
        });
    };

    const createMutation = useMutation({
        mutationFn: (content: string) =>
            createTaskComment(taskId as number, content),
        onSuccess: () => {
            invalidate();
        },
        onError: () => {
            toast.error("Could not add comment", {
                description: "Verify your permissions and try again.",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (commentId: number) =>
            deleteTaskComment(taskId as number, commentId),
        onSuccess: () => {
            toast.success("Comment deleted");
            invalidate();
        },
        onError: () => {
            toast.error("Could not delete comment", {
                description: "Only the author or an org admin can delete this.",
            });
        },
    });

    return { createMutation, deleteMutation };
}
