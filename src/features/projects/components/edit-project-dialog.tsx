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
import { PROJECT_STATUS_LABELS } from "@/features/dashboard/utils/dashboard.utils";
import { useProjectMutations } from "../hooks/use-project-mutations";
import { ProjectManagerSelect } from "./project-manager-select";
import type { ProjectListItem, ProjectStatus } from "../types/projects.types";

const STATUS_OPTIONS = Object.keys(PROJECT_STATUS_LABELS) as ProjectStatus[];

type EditProjectDialogProps = {
    project: ProjectListItem | null;
    onClose: () => void;
    organizationId: number;
    members: OrganizationMemberResponseDto[];
};

export function EditProjectDialog({
    project,
    onClose,
    organizationId,
    members,
}: EditProjectDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [managerId, setManagerId] = useState<number | null>(null);
    const [status, setStatus] = useState<ProjectStatus>("ACTIVE");

    const { updateMutation } = useProjectMutations(organizationId);

    useEffect(() => {
        if (project) {
            setName(project.name);
            setDescription(project.description ?? "");
            setManagerId(project.managerId);
            setStatus(project.status);
        }
    }, [project]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (!project) return;

        const trimmedName = name.trim();

        if (!trimmedName) {
            toast.error("Name is required");
            return;
        }

        updateMutation.mutate(
            {
                id: project.id,
                data: {
                    name: trimmedName,
                    description: description.trim() || undefined,
                    managerId: managerId ?? undefined,
                    status,
                },
            },
            { onSuccess: () => onClose() }
        );
    };

    return (
        <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit project</DialogTitle>
                        <DialogDescription>
                            Update the project's details.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="project-edit-name">Name</Label>
                            <FieldInput
                                id="project-edit-name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                disabled={updateMutation.isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="project-edit-description">
                                Description
                            </Label>
                            <textarea
                                id="project-edit-description"
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

                        <div className="space-y-1.5">
                            <Label htmlFor="project-edit-status">Status</Label>
                            <select
                                id="project-edit-status"
                                value={status}
                                disabled={updateMutation.isPending}
                                onChange={(event) =>
                                    setStatus(event.target.value as ProjectStatus)
                                }
                                className="w-full rounded-xl border border-border/80 bg-white/95 px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/15"
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {PROJECT_STATUS_LABELS[option]}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Manager</Label>
                            <ProjectManagerSelect
                                members={members}
                                value={managerId}
                                onChange={setManagerId}
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
                            disabled={updateMutation.isPending || !name.trim()}
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
