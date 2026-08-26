import { useState } from "react";
import type { OrganizationFindOneResponseDto } from "@/shared/api/generated";
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
import { useOrgMutations } from "../hooks/use-org-mutations";

type OrgEditDialogProps = {
    organization: OrganizationFindOneResponseDto | null;
    onClose: () => void;
};

export function OrgEditDialog({ organization, onClose }: OrgEditDialogProps) {
    const [name, setName] = useState(() => organization?.name ?? "");
    const [description, setDescription] = useState(() => organization?.description ?? "");
    const { updateMutation } = useOrgMutations(organization?.id ?? 0);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!organization || !name.trim()) return;

        updateMutation.mutate(
            {
                id: organization.id,
                data: {
                    name: name.trim(),
                    description: description.trim() || undefined,
                },
            },
            { onSuccess: onClose }
        );
    };

    return (
        <Dialog open={!!organization} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit organization</DialogTitle>
                        <DialogDescription>
                            Update the organization name and its public description.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="organization-name">Name</Label>
                            <FieldInput
                                id="organization-name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                disabled={updateMutation.isPending}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="organization-description">Description</Label>
                            <textarea
                                id="organization-description"
                                rows={4}
                                value={description}
                                disabled={updateMutation.isPending}
                                onChange={(event) => setDescription(event.target.value)}
                                className={cn("w-full resize-none rounded-xl border border-border/80 bg-white/95 px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/15 dark:bg-input/30")}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={updateMutation.isPending}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateMutation.isPending || !name.trim()}>
                            {updateMutation.isPending ? <><Spinner className="size-4" />Saving...</> : "Save changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
