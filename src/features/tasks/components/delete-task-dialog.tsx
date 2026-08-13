import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import { Spinner } from "@/shared/ui/spinner";
import { useTaskMutations } from "../hooks/use-task-mutations";
import type { TaskListItem } from "../types/tasks.types";

type DeleteTaskDialogProps = {
    task: TaskListItem | null;
    onClose: () => void;
    projectId: number;
    onDeleted?: () => void;
};

export function DeleteTaskDialog({
    task,
    onClose,
    projectId,
    onDeleted,
}: DeleteTaskDialogProps) {
    const { deleteMutation } = useTaskMutations(projectId);

    const handleConfirm = () => {
        if (!task) return;
        deleteMutation.mutate(task.id, {
            onSuccess: () => {
                onClose();
                onDeleted?.();
            },
        });
    };

    return (
        <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete task</DialogTitle>
                    <DialogDescription>
                        This will permanently delete{" "}
                        <span className="font-semibold text-foreground">
                            {task?.title}
                        </span>{" "}
                        and its comments. This cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={deleteMutation.isPending}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={deleteMutation.isPending}
                        className="shadow-md shadow-destructive/20"
                    >
                        {deleteMutation.isPending ? (
                            <>
                                <Spinner className="size-4" />
                                Deleting…
                            </>
                        ) : (
                            <>
                                <Trash2 className="size-4" />
                                Delete task
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
