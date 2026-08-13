import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Search, ShieldCheck, Users } from "lucide-react";
import { useUsersControllerFindAll } from "@/shared/api/generated";
import type { UserResponseDtoRoles } from "@/shared/api/generated";
import { DashboardCard, DashboardHero, DashboardShell } from "@/features/dashboard";
import { GlobalRoleBadge } from "@/features/organizations";
import { FieldInput } from "@/features/auth/components/FieldInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { pathBuilder } from "@/shared/config/routes";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";

/** The generated client types `UserRole` as a single string, but the API
 * actually returns `{ role }[]` (see userGetAllSelect on the backend). */
function primaryRoleOf(user: { UserRole: unknown }): UserResponseDtoRoles | undefined {
    const roles = user.UserRole as { role: UserResponseDtoRoles }[] | undefined;
    return roles?.[0]?.role;
}

export default function RolesManagementPage() {
    const [search, setSearch] = useState("");

    const usersQuery = useUsersControllerFindAll();
    const users = usersQuery.data?.data ?? [];

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
                description="Every registered user and their global role. Director, Manager, and Employee roles are assigned at registration and control platform-wide permissions such as creating organizations."
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
                                        <Link
                                            to={pathBuilder.userProfile(user.id)}
                                            className="group flex items-center gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3 transition-all hover:border-primary/25 hover:bg-primary/5"
                                        >
                                            <Avatar className="size-9 shrink-0 border border-border">
                                                {avatarSrc ? (
                                                    <AvatarImage
                                                        src={avatarSrc}
                                                        alt={user.name}
                                                    />
                                                ) : null}
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
                                            {role ? (
                                                <GlobalRoleBadge role={role} className="shrink-0" />
                                            ) : null}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </DashboardCard>
        </DashboardShell>
    );
}
