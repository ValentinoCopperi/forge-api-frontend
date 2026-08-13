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
import { useProjectMutations } from "../hooks/use-project-mutations";
import type { ProjectListItem } from "../types/projects.types";

type DeleteProjectDialogProps = {
    project: ProjectListItem | null;
    onClose: () => void;
    organizationId: number;
    onDeleted?: () => void;
};

export function DeleteProjectDialog({
    project,
    onClose,
    organizationId,
    onDeleted,
}: DeleteProjectDialogProps) {
    const { deleteMutation } = useProjectMutations(organizationId);

    const handleConfirm = () => {
        if (!project) return;
        deleteMutation.mutate(project.id, {
            onSuccess: () => {
                onClose();
                onDeleted?.();
            },
        });
    };

    return (
        <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete project</DialogTitle>
                    <DialogDescription>
                        This will permanently delete{" "}
                        <span className="font-semibold text-foreground">
                            {project?.name}
                        </span>{" "}
                        and all of its tasks. This cannot be undone.
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
                                Delete project
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
