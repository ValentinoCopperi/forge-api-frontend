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
import { useProjectMutations } from "../hooks/use-project-mutations";
import { ProjectManagerSelect } from "./project-manager-select";

type CreateProjectDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organizationId: number;
    members: OrganizationMemberResponseDto[];
};

export function CreateProjectDialog({
    open,
    onOpenChange,
    organizationId,
    members,
}: CreateProjectDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [managerId, setManagerId] = useState<number | null>(null);

    const { createMutation } = useProjectMutations(organizationId);

    const reset = () => {
        setName("");
        setDescription("");
        setManagerId(null);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            toast.error("Name is required");
            return;
        }

        if (!managerId) {
            toast.error("Select a manager for the project");
            return;
        }

        createMutation.mutate(
            {
                name: trimmedName,
                description: description.trim() || undefined,
                organizationId,
                managerId,
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
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create project</DialogTitle>
                        <DialogDescription>
                            Add a new project to this organization.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="project-create-name">Name</Label>
                            <FieldInput
                                id="project-create-name"
                                value={name}
                                placeholder="Website Redesign"
                                onChange={(event) => setName(event.target.value)}
                                disabled={createMutation.isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="project-create-description">
                                Description
                            </Label>
                            <textarea
                                id="project-create-description"
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

                        <div className="space-y-1.5">
                            <Label>Manager</Label>
                            <ProjectManagerSelect
                                members={members}
                                value={managerId}
                                onChange={setManagerId}
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
                            disabled={createMutation.isPending || !name.trim()}
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
