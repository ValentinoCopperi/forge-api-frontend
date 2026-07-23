import { Trash2 } from "lucide-react";
import type {
    OrganizationMemberResponseDto,
    OrganizationsGetAllByUserResponseDtoRole,
    RemoveUserFromOrganizationDto,
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
import { Spinner } from "@/shared/ui/spinner";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";

type RemoveMemberDialogProps = {
    member: OrganizationMemberResponseDto | null;
    onClose: () => void;
    orgId: number;
    isPending: boolean;
    onRemove: (data: { data: RemoveUserFromOrganizationDto }) => void;
};

export function RemoveMemberDialog({
    member,
    onClose,
    orgId,
    isPending,
    onRemove,
}: RemoveMemberDialogProps) {
    const handleConfirm = () => {
        if (!member) return;
        onRemove({ data: { organizationId: orgId, userId: member.User.id } });
    };

    const user = member?.User;
    const avatarSrc = getAvatarSrc(user?.avatarUrl);

    return (
        <Dialog open={!!member} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Remove member</DialogTitle>
                    <DialogDescription>
                        This will revoke{" "}
                        <span className="font-semibold text-foreground">
                            {user?.name}
                        </span>
                        's access. They can be re-added at any time.
                    </DialogDescription>
                </DialogHeader>

                {/* Member preview */}
                <div className="flex items-center gap-3 rounded-2xl border border-destructive/25 bg-destructive/6 p-3">
                    <Avatar className="size-10 shrink-0 border border-destructive/20 shadow-sm">
                        {avatarSrc ? (
                            <AvatarImage src={avatarSrc} alt={user?.name} />
                        ) : null}
                        <AvatarFallback className="bg-destructive/10 text-sm font-semibold text-destructive">
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
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isPending}
                        className="shadow-md shadow-destructive/20"
                    >
                        {isPending ? (
                            <>
                                <Spinner className="size-4" />
                                Removing…
                            </>
                        ) : (
                            <>
                                <Trash2 className="size-4" />
                                Remove member
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
