import { useState } from "react";
import { toast } from "sonner";
import type { OrganizationMemberResponseDto } from "@/shared/api/generated";
import { FieldInput } from "@/features/auth/components/FieldInput";
import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Spinner } from "@/shared/ui/spinner";
import { cn } from "@/shared/utils/utils";
import {
    TASK_CATEGORY_LABELS,
    TASK_PRIORITY_LABELS,
} from "../utils/tasks.utils";
import { useTaskMutations } from "../hooks/use-task-mutations";
import { TaskAssigneeSelect } from "./task-assignee-select";
import type { TaskCategory, TaskPriority } from "../types/tasks.types";

const selectClassName =
    "w-full rounded-xl border border-border/80 bg-white/95 px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/15";

type CreateTaskDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: number;
    members: OrganizationMemberResponseDto[];
};

export function CreateTaskDialog({
    open,
    onOpenChange,
    projectId,
    members,
}: CreateTaskDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
    const [category, setCategory] = useState<TaskCategory>("OTRO");
    const [deadline, setDeadline] = useState("");
    const [assigneeId, setAssigneeId] = useState<number | null>(null);

    const { createMutation } = useTaskMutations(projectId);

    const reset = () => {
        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setCategory("OTRO");
        setDeadline("");
        setAssigneeId(null);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            toast.error("Title is required");
            return;
        }

        createMutation.mutate(
            {
                title: trimmedTitle,
                description: description.trim() || undefined,
                projectId,
                priority,
                category,
                deadline: deadline ? new Date(deadline).toISOString() : undefined,
                designatedTo: assigneeId ?? undefined,
            },
            {
                onSuccess: () => {
                    reset();
                    onOpenChange(false);
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-lg">
                <form onSubmit={handleSubmit} className="flex min-h-0 flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>Create task</DialogTitle>
                        <DialogDescription>
                            Add a new task to this project.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-1">
                        <div className="space-y-1.5">
                            <Label htmlFor="task-create-title">Title</Label>
                            <FieldInput
                                id="task-create-title"
                                value={title}
                                placeholder="Design the landing page hero section"
                                onChange={(event) => setTitle(event.target.value)}
                                disabled={createMutation.isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="task-create-description">
                                Description
                            </Label>
                            <textarea
                                id="task-create-description"
                                value={description}
                                placeholder="Optional description"
                                rows={3}
                                disabled={createMutation.isPending}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                className={cn(
                                    "w-full resize-none rounded-xl border border-border/80 bg-white/95 px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/15"
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="task-create-priority">Priority</Label>
                                <select
                                    id="task-create-priority"
                                    value={priority}
                                    disabled={createMutation.isPending}
                                    onChange={(event) =>
                                        setPriority(event.target.value as TaskPriority)
                                    }
                                    className={selectClassName}
                                >
                                    {Object.entries(TASK_PRIORITY_LABELS).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="task-create-category">Category</Label>
                                <select
                                    id="task-create-category"
                                    value={category}
                                    disabled={createMutation.isPending}
                                    onChange={(event) =>
                                        setCategory(event.target.value as TaskCategory)
                                    }
                                    className={selectClassName}
                                >
                                    {Object.entries(TASK_CATEGORY_LABELS).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="task-create-deadline">Deadline</Label>
                            <input
                                id="task-create-deadline"
                                type="date"
                                value={deadline}
                                disabled={createMutation.isPending}
                                onChange={(event) => setDeadline(event.target.value)}
                                className={selectClassName}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Assignee</Label>
                            <TaskAssigneeSelect
                                members={members}
                                value={assigneeId}
                                onChange={setAssigneeId}
                                disabled={createMutation.isPending}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={createMutation.isPending}
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createMutation.isPending || !title.trim()}
                        >
                            {createMutation.isPending ? (
                                <>
                                    <Spinner className="size-4" />
                                    Creating...
                                </>
                            ) : (
                                "Create"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
