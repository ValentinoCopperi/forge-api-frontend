import { useMemo, useState } from "react";
import { AlertTriangle, RefreshCw, Search, UserPlus, Users } from "lucide-react";
import type {
    AddUserToOrganizationDto,
    AddUserToOrganizationDtoRole,
    GetAllUsersResponseDto,
    UserResponseDtoRoles,
} from "@/shared/api/generated";
import { GlobalRoleBadge } from "@/features/organizations";
import { FieldInput } from "@/features/auth/components/FieldInput";
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
import { Skeleton } from "@/shared/ui/skeleton";
import { Spinner } from "@/shared/ui/spinner";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { cn } from "@/shared/utils/utils";
import { useUsersControllerFindAll } from "../api";
import { OrgRoleSelect } from "./org-role-select";

type AddMemberDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    orgId: number;
    memberUserIds: Set<number>;
    isPending: boolean;
    onAdd: (data: { data: AddUserToOrganizationDto }) => void;
};

function UserListSkeleton() {
    return (
        <div className="space-y-1">
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                >
                    <Skeleton className="size-9 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3.5 w-32" />
                        <Skeleton className="h-3 w-44" />
                    </div>
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
            ))}
        </div>
    );
}

export function AddMemberDialog({
    open,
    onOpenChange,
    orgId,
    memberUserIds,
    isPending,
    onAdd,
}: AddMemberDialogProps) {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<GetAllUsersResponseDto | null>(null);
    const [role, setRole] = useState<AddUserToOrganizationDtoRole>("MEMBER");

    const usersQuery = useUsersControllerFindAll();
    const allUsers = usersQuery.data?.data ?? [];

    const availableUsers = useMemo(
        () => allUsers.filter((u) => !memberUserIds.has(u.id)),
        [allUsers, memberUserIds]
    );

    const filteredUsers = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return availableUsers;
        return availableUsers.filter(
            (u) =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q)
        );
    }, [availableUsers, search]);

    const handleClose = () => {
        setSearch("");
        setSelected(null);
        setRole("MEMBER");
        onOpenChange(false);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selected) return;
        onAdd({ data: { organizationId: orgId, userId: selected.id, role } });
    };

    const isAllMembersAlready =
        !usersQuery.isLoading &&
        !usersQuery.isError &&
        availableUsers.length === 0 &&
        allUsers.length > 0;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Add member</DialogTitle>
                    <DialogDescription>
                        Select a user from the directory to add them to this
                        organization.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="flex min-h-0 flex-1 flex-col gap-4"
                >
                    {/* Search */}
                    <FieldInput
                        icon={Search}
                        placeholder="Search by name or email…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        disabled={
                            usersQuery.isLoading || usersQuery.isError || isPending
                        }
                    />

                    {/* User list */}
                    <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-border/70 bg-muted/10">
                        {usersQuery.isLoading ? (
                            <div className="p-2">
                                <UserListSkeleton />
                            </div>
                        ) : usersQuery.isError ? (
                            <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                                <AlertTriangle className="size-7 text-destructive/60" />
                                <p className="mt-2.5 text-sm font-semibold text-muted-foreground">
                                    Could not load users
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="mt-3"
                                    onClick={() => void usersQuery.refetch()}
                                >
                                    <RefreshCw className="size-3.5" />
                                    Retry
                                </Button>
                            </div>
                        ) : isAllMembersAlready ? (
                            <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                                <Users className="size-7 text-muted-foreground/40" />
                                <p className="mt-2.5 text-sm font-semibold text-muted-foreground">
                                    All users are already members
                                </p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
                                <Search className="size-7 text-muted-foreground/40" />
                                <p className="mt-2.5 text-sm font-semibold text-muted-foreground">
                                    No users match "{search}"
                                </p>
                            </div>
                        ) : (
                            <ul className="p-2">
                                {filteredUsers.map((user) => {
                                    const avatarSrc = getAvatarSrc(user.avatarUrl);
                                    const isSelected = selected?.id === user.id;
                                    return (
                                        <li key={user.id}>
                                            <button
                                                type="button"
                                                disabled={isPending}
                                                onClick={() =>
                                                    setSelected(
                                                        isSelected ? null : user
                                                    )
                                                }
                                                className={cn(
                                                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all",
                                                    isSelected
                                                        ? "bg-primary/10 ring-1 ring-primary/30"
                                                        : "hover:bg-muted/60"
                                                )}
                                            >
                                                <Avatar className="size-9 shrink-0 border border-border shadow-sm">
                                                    {avatarSrc ? (
                                                        <AvatarImage
                                                            src={avatarSrc}
                                                            alt={user.name}
                                                        />
                                                    ) : null}
                                                    <AvatarFallback
                                                        className={cn(
                                                            "text-xs font-semibold",
                                                            isSelected
                                                                ? "bg-primary/15 text-primary"
                                                                : "bg-muted text-muted-foreground"
                                                        )}
                                                    >
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 flex-1">
                                                    <p
                                                        className={cn(
                                                            "truncate text-sm font-semibold",
                                                            isSelected
                                                                ? "text-primary"
                                                                : "text-foreground"
                                                        )}
                                                    >
                                                        {user.name}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                {typeof user.UserRole === "string" && (
                                                    <GlobalRoleBadge
                                                        role={user.UserRole as UserResponseDtoRoles}
                                                        className="shrink-0"
                                                    />
                                                )}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    {/* Count hint */}
                    {!usersQuery.isLoading &&
                        !usersQuery.isError &&
                        availableUsers.length > 0 && (
                            <p className="text-xs text-muted-foreground">
                                {filteredUsers.length} of {availableUsers.length}{" "}
                                available{" "}
                                {availableUsers.length === 1 ? "user" : "users"} ·{" "}
                                {memberUserIds.size}{" "}
                                {memberUserIds.size === 1 ? "member" : "members"}{" "}
                                already in org
                            </p>
                        )}

                    {/* Role selector */}
                    <div className="space-y-2">
                        <Label>Role</Label>
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
                            onClick={handleClose}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || !selected}
                        >
                            {isPending ? (
                                <>
                                    <Spinner className="size-4" />
                                    Adding…
                                </>
                            ) : selected ? (
                                <>
                                    <UserPlus className="size-4" />
                                    Add {selected.name.split(" ")[0]}
                                </>
                            ) : (
                                "Select a user"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
