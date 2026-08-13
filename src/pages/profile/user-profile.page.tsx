import { useParams } from "react-router-dom";
import { Calendar, Mail, RefreshCw, User } from "lucide-react";
import { DashboardCard, DashboardShell } from "@/features/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { formatDashboardDate } from "@/features/dashboard/utils/dashboard.utils";
import { GlobalRoleBadge } from "@/features/organizations";
import { useUserProfile } from "@/features/users";

export default function UserProfilePage() {
    const { userId } = useParams<{ userId: string }>();
    const id = Number(userId);

    const { data: user, isLoading, isError, refetch } = useUserProfile(id);

    if (isLoading) {
        return (
            <DashboardShell>
                <DashboardCard>
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <Skeleton className="mt-4 h-6 w-48" />
                    <Skeleton className="mt-2 h-4 w-64" />
                </DashboardCard>
            </DashboardShell>
        );
    }

    if (isError || !user) {
        return (
            <DashboardShell>
                <DashboardCard>
                    <p className="text-sm font-medium text-muted-foreground">
                        Could not load this user's profile.
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        onClick={() => void refetch()}
                    >
                        <RefreshCw className="size-4" />
                        Retry
                    </Button>
                </DashboardCard>
            </DashboardShell>
        );
    }

    const avatarSrc = getAvatarSrc(user.avatarUrl);

    return (
        <DashboardShell>
            <DashboardCard className="p-6 sm:p-8">
                <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                    <Avatar className="size-20 shrink-0 rounded-3xl border-4 border-card shadow-xl shadow-primary/15">
                        {avatarSrc ? (
                            <AvatarImage src={avatarSrc} alt={user.name} />
                        ) : null}
                        <AvatarFallback className="rounded-3xl bg-primary/15 text-2xl font-bold text-primary">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/12 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase">
                                <User className="size-3" />
                                Profile
                            </span>
                            {user.roles.map((role) => (
                                <GlobalRoleBadge key={role} role={role} />
                            ))}
                        </div>
                        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                            {user.name}
                        </h1>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                        <Mail className="size-3.5 shrink-0" />
                        <span className="font-medium text-foreground">
                            {user.email}
                        </span>
                    </span>

                    <span className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                        <Calendar className="size-3.5 shrink-0" />
                        <span>
                            Member since{" "}
                            <span className="font-medium text-foreground">
                                {formatDashboardDate(user.createdAt)}
                            </span>
                        </span>
                    </span>
                </div>
            </DashboardCard>
        </DashboardShell>
    );
}
