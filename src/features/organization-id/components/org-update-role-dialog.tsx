import { useEffect, useState } from "react";
import type {
    AddUserToOrganizationDtoRole,
    OrganizationMemberResponseDto,
    OrganizationsGetAllByUserResponseDtoRole,
    UpdateUserOrganizationRoleDto,
    UpdateUserOrganizationRoleDtoRole,
} from "@/shared/api/generated";
import { OrganizationRoleBadge } from "@/features/organizations";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
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
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { OrgRoleSelect } from "./org-role-select";

type UpdateRoleDialogProps = {
    member: OrganizationMemberResponseDto | null;
    onClose: () => void;
    orgId: number;
    isPending: boolean;
    onUpdate: (data: { data: UpdateUserOrganizationRoleDto }) => void;
};

export function UpdateRoleDialog({
    member,
    onClose,
    orgId,
    isPending,
    onUpdate,
}: UpdateRoleDialogProps) {
    const [role, setRole] = useState<AddUserToOrganizationDtoRole>("MEMBER");

    useEffect(() => {
        if (member) {
            setRole(member.role as AddUserToOrganizationDtoRole);
        }
    }, [member]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!member) return;
        onUpdate({
            data: {
                organizationId: orgId,
                userId: member.User.id,
                role: role as UpdateUserOrganizationRoleDtoRole,
            },
        });
    };

    const user = member?.User;
    const avatarSrc = getAvatarSrc(user?.avatarUrl);
    const isUnchanged = member ? role === member.role : true;

    return (
        <Dialog open={!!member} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Update role</DialogTitle>
                    <DialogDescription>
                        Change{" "}
                        <span className="font-semibold text-foreground">
                            {user?.name}
                        </span>
                        's access level in this organization.
                    </DialogDescription>
                </DialogHeader>

                {/* Member preview */}
                <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/20 p-3">
                    <Avatar className="size-10 shrink-0 border border-border shadow-sm">
                        {avatarSrc ? (
                            <AvatarImage src={avatarSrc} alt={user?.name} />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                            {getInitials(user?.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">
                            {user?.name}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>
                    {member && (
                        <OrganizationRoleBadge
                            role={member.role as OrganizationsGetAllByUserResponseDtoRole}
                            className="shrink-0"
                        />
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>New role</Label>
                        <OrgRoleSelect
                            value={role}
                            onChange={setRole}
                            disabled={isPending}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || isUnchanged}
                        >
                            {isPending ? (
                                <>
                                    <Spinner className="size-4" />
                                    Updating…
                                </>
                            ) : (
                                "Update role"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
