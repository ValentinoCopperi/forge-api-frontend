import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getOrganizationsControllerFindAllByUserIdQueryKey,
    getOrganizationsControllerFindAllQueryKey,
    useOrganizationsControllerCreate,
} from "@/shared/api/generated";
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

type CreateOrganizationDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function CreateOrganizationDialog({
    open,
    onOpenChange,
}: CreateOrganizationDialogProps) {
    const queryClient = useQueryClient();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const createMutation = useOrganizationsControllerCreate({
        mutation: {
            onSuccess: () => {
                toast.success("Organization created", {
                    description: `"${name.trim()}" is ready to use.`,
                });
                queryClient.invalidateQueries({
                    queryKey: getOrganizationsControllerFindAllByUserIdQueryKey(),
                });
                queryClient.invalidateQueries({
                    queryKey: getOrganizationsControllerFindAllQueryKey(),
                });
                setName("");
                setDescription("");
                onOpenChange(false);
            },
            onError: () => {
                toast.error("Could not create organization", {
                    description:
                        "Verify your permissions and try again.",
                });
            },
        },
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const trimmedName = name.trim();

        if (!trimmedName) {
            toast.error("Name is required");
            return;
        }

        createMutation.mutate({
            data: {
                name: trimmedName,
                description: description.trim() || undefined,
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create organization</DialogTitle>
                        <DialogDescription>
                            A new workspace will be created and you will be
                            assigned as owner.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="org-create-name">Name</Label>
                            <FieldInput
                                id="org-create-name"
                                value={name}
                                placeholder="Acme Corp"
                                onChange={(event) => setName(event.target.value)}
                                disabled={createMutation.isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="org-create-description">
                                Description
                            </Label>
                            <textarea
                                id="org-create-description"
                                value={description}
                                placeholder="Optional description for your team"
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
