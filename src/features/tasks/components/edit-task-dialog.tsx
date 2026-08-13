import { useEffect, useState } from "react";
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
    TASK_STATUS_LABELS,
} from "../utils/tasks.utils";
import { useTaskMutations } from "../hooks/use-task-mutations";
import { TaskAssigneeSelect } from "./task-assignee-select";
import type {
    TaskCategory,
    TaskListItem,
    TaskPriority,
    TaskStatus,
} from "../types/tasks.types";

const selectClassName =
    "w-full rounded-xl border border-border/80 bg-white/95 px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/15";

type EditTaskDialogProps = {
    task: TaskListItem | null;
    onClose: () => void;
    projectId: number;
    members: OrganizationMemberResponseDto[];
};

export function EditTaskDialog({
    task,
    onClose,
    projectId,
    members,
}: EditTaskDialogProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState<TaskStatus>("PENDING");
    const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
    const [category, setCategory] = useState<TaskCategory>("OTRO");
    const [deadline, setDeadline] = useState("");
    const [assigneeId, setAssigneeId] = useState<number | null>(null);

    const { updateMutation } = useTaskMutations(projectId);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description ?? "");
            setStatus(task.status);
            setPriority(task.priority);
            setCategory(task.category);
            setDeadline(task.deadline ? task.deadline.slice(0, 10) : "");
            setAssigneeId(task.User_Task_designatedToToUser?.id ?? null);
        }
    }, [task]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!task) return;

        const trimmedTitle = title.trim();

        if (!trimmedTitle) {
            toast.error("Title is required");
            return;
        }

        updateMutation.mutate(
            {
                id: task.id,
                data: {
                    title: trimmedTitle,
                    description: description.trim() || undefined,
                    status,
                    priority,
                    category,
                    deadline: deadline
                        ? new Date(deadline).toISOString()
                        : undefined,
                    designatedTo: assigneeId ?? undefined,
                },
            },
            { onSuccess: () => onClose() }
        );
    };

    return (
        <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-lg">
                <form onSubmit={handleSubmit} className="flex min-h-0 flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>Edit task</DialogTitle>
                        <DialogDescription>
                            Update the task's details.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-1">
                        <div className="space-y-1.5">
                            <Label htmlFor="task-edit-title">Title</Label>
                            <FieldInput
                                id="task-edit-title"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                disabled={updateMutation.isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="task-edit-description">Description</Label>
                            <textarea
                                id="task-edit-description"
                                value={description}
                                rows={3}
                                disabled={updateMutation.isPending}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                className={cn(
                                    "w-full resize-none rounded-xl border border-border/80 bg-white/95 px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/15"
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="task-edit-status">Status</Label>
                                <select
                                    id="task-edit-status"
                                    value={status}
                                    disabled={updateMutation.isPending}
                                    onChange={(event) =>
                                        setStatus(event.target.value as TaskStatus)
                                    }
                                    className={selectClassName}
                                >
                                    {Object.entries(TASK_STATUS_LABELS).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="task-edit-priority">Priority</Label>
                                <select
                                    id="task-edit-priority"
                                    value={priority}
                                    disabled={updateMutation.isPending}
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
                                <Label htmlFor="task-edit-category">Category</Label>
                                <select
                                    id="task-edit-category"
                                    value={category}
                                    disabled={updateMutation.isPending}
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
                            <Label htmlFor="task-edit-deadline">Deadline</Label>
                            <input
                                id="task-edit-deadline"
                                type="date"
                                value={deadline}
                                disabled={updateMutation.isPending}
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
                                disabled={updateMutation.isPending}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={updateMutation.isPending}
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={updateMutation.isPending || !title.trim()}
                        >
                            {updateMutation.isPending ? (
                                <>
                                    <Spinner className="size-4" />
                                    Saving...
                                </>
                            ) : (
                                "Save changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
