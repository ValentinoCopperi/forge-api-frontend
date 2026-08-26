import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Edit3, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";
import { useUsersControllerFindAll } from "@/shared/api/generated";
import type { UserResponseDtoRoles } from "@/shared/api/generated";
import { DashboardCard, DashboardHero, DashboardShell } from "@/features/dashboard";
import { GlobalRoleBadge } from "@/features/organizations";
import { FieldInput } from "@/features/auth/components/FieldInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
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
import { pathBuilder } from "@/shared/config/routes";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import {
    GLOBAL_ROLES,
    type GlobalRole,
    useUpdateUserRoles,
} from "@/features/users/api/users.api";

/** The generated client types `UserRole` as a single string, but the API
 * actually returns `{ role }[]` (see userGetAllSelect on the backend). */
function primaryRoleOf(user: { UserRole: unknown }): UserResponseDtoRoles | undefined {
    const roles = user.UserRole as { role: UserResponseDtoRoles }[] | undefined;
    return roles?.[0]?.role;
}

function rolesOf(user: { UserRole: unknown }): GlobalRole[] {
    const roles = user.UserRole as { role: GlobalRole }[] | undefined;
    return roles?.map(({ role }) => role) ?? [];
}

const ROLE_LABELS: Record<GlobalRole, string> = {
    DIRECTOR: "Director",
    GERENTE: "Manager",
    EMPLEADO: "Employee",
};

type ListedUser = {
    id: number;
    name: string;
    email: string;
    avatarUrl: unknown;
    UserRole: unknown;
};

const EMPTY_USERS: ListedUser[] = [];

function EditGlobalRolesDialog({
    user,
    onClose,
}: {
    user: ListedUser | null;
    onClose: () => void;
}) {
    const [roles, setRoles] = useState<GlobalRole[]>(() => user ? rolesOf(user) : []);
    const updateRoles = useUpdateUserRoles();

    const toggleRole = (role: GlobalRole) => {
        setRoles((current) =>
            current.includes(role)
                ? current.filter((item) => item !== role)
                : [...current, role]
        );
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!user || roles.length === 0) return;

        updateRoles.mutate({ id: user.id, roles }, { onSuccess: onClose });
    };

    return (
        <Dialog open={!!user} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Update global roles</DialogTitle>
                        <DialogDescription>
                            Choose every platform-level role for {user?.name}. At least one role is required.
                        </DialogDescription>
                    </DialogHeader>

                    <fieldset className="mt-5 space-y-2" disabled={updateRoles.isPending}>
                        <legend className="sr-only">Global roles</legend>
                        {GLOBAL_ROLES.map((role) => (
                            <Label
                                key={role}
                                className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-muted/20 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/50 has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5"
                            >
                                <input
                                    type="checkbox"
                                    checked={roles.includes(role)}
                                    onChange={() => toggleRole(role)}
                                    className="size-4 accent-primary"
                                />
                                {ROLE_LABELS[role]}
                            </Label>
                        ))}
                    </fieldset>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" disabled={updateRoles.isPending} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={updateRoles.isPending || roles.length === 0}>
                            {updateRoles.isPending ? <><Spinner className="size-4" />Saving...</> : "Save roles"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function RolesManagementPage() {
    const [search, setSearch] = useState("");
    const [editingUser, setEditingUser] = useState<ListedUser | null>(null);
    const currentUser = useAuthStore((state) => state.user);
    const currentRoles = (currentUser?.roles as unknown as GlobalRole[] | undefined) ?? [];
    const canManageRoles = currentRoles.includes("DIRECTOR");

    const usersQuery = useUsersControllerFindAll();
    const users = usersQuery.data?.data ?? EMPTY_USERS;

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return users;
        return users.filter(
            (user) =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
        );
    }, [users, search]);

    return (
        <DashboardShell>
            <DashboardHero
                badge={{ icon: ShieldCheck, label: "Access" }}
                title="Roles & Management"
                description={canManageRoles
                    ? "Assign platform-wide roles without leaving the team directory. Changes take effect when the recipient signs in again."
                    : "Every registered user and their platform-wide access role. Only directors can change global roles."}
            />

            <DashboardCard>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="max-w-sm flex-1">
                        <FieldInput
                            icon={Search}
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            aria-label="Search users"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={usersQuery.isFetching}
                        onClick={() => void usersQuery.refetch()}
                    >
                        <RefreshCw
                            className={usersQuery.isFetching ? "size-4 animate-spin" : "size-4"}
                        />
                        Refresh
                    </Button>
                </div>

                <div className="mt-6">
                    {usersQuery.isLoading ? (
                        <div className="space-y-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-14 w-full" />
                            ))}
                        </div>
                    ) : usersQuery.isError ? (
                        <div className="rounded-2xl border border-dashed border-destructive/25 bg-destructive/5 px-6 py-10 text-center">
                            <p className="text-sm font-medium text-muted-foreground">
                                Could not load users.
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-3"
                                onClick={() => void usersQuery.refetch()}
                            >
                                <RefreshCw className="size-4" />
                                Retry
                            </Button>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-6 py-14 text-center">
                            <Users className="mx-auto size-8 text-muted-foreground/40" />
                            <p className="mt-3 text-sm font-medium text-foreground">
                                {users.length === 0
                                    ? "No users registered yet."
                                    : "No users match your search."}
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {filteredUsers.map((user) => {
                                const avatarSrc = getAvatarSrc(user.avatarUrl);
                                const role = primaryRoleOf(user);

                                return (
                                    <li key={user.id}>
                                        <div className="group flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                                            <Link to={pathBuilder.userProfile(user.id)} className="flex min-w-0 flex-1 items-center gap-3 rounded-md outline-none focus-visible:ring-3 focus-visible:ring-ring/25">
                                                <Avatar className="size-9 shrink-0 border border-border">
                                                    {avatarSrc ? <AvatarImage src={avatarSrc} alt={user.name} /> : null}
                                                    <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                                                    {user.name}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {user.email}
                                                </p>
                                                </div>
                                            </Link>
                                            {role ? (
                                                <GlobalRoleBadge role={role} className="shrink-0" />
                                            ) : null}
                                            {canManageRoles && currentUser?.id !== user.id ? (
                                                <Button type="button" size="sm" variant="outline" onClick={() => setEditingUser(user)}>
                                                    <Edit3 className="size-3.5" />
                                                    Roles
                                                </Button>
                                            ) : null}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </DashboardCard>
            {editingUser ? (
                <EditGlobalRolesDialog user={editingUser} onClose={() => setEditingUser(null)} />
            ) : null}
        </DashboardShell>
    );
}
