import { AlertTriangle, RefreshCw } from "lucide-react";
import { DashboardCard, DashboardShell } from "@/features/dashboard";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";

function MembersTableSkeleton() {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
                <thead>
                    <tr className="border-b border-border dashboard-table-head">
                        {["Member", "Role", "User ID", "Membership ID", ""].map(
                            (h) => (
                                <th key={h} className="px-5 py-3">
                                    <Skeleton className="h-3 w-16" />
                                </th>
                            )
                        )}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <tr
                            key={i}
                            className="border-b border-border/60 last:border-b-0"
                        >
                            <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="size-10 shrink-0 rounded-full" />
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-44" />
                                    </div>
                                </div>
                            </td>
                            <td className="px-5 py-4">
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </td>
                            <td className="px-5 py-4">
                                <Skeleton className="h-3 w-10" />
                            </td>
                            <td className="px-5 py-4">
                                <Skeleton className="h-3 w-10" />
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex justify-end">
                                    <Skeleton className="size-8 rounded-xl" />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function OrgPageSkeleton() {
    return (
        <DashboardShell>
            <div className="dashboard-hero-surface overflow-hidden">
                <Skeleton className="h-32 w-full rounded-none sm:h-44" />
                <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                    <div className="-mt-12 flex items-end gap-4 sm:-mt-14">
                        <Skeleton className="size-20 shrink-0 rounded-3xl sm:size-24" />
                        <div className="space-y-2 pb-1">
                            <Skeleton className="h-4 w-28 rounded-full" />
                            <Skeleton className="h-7 w-48 sm:h-9 sm:w-64" />
                        </div>
                    </div>
                    <div className="mt-5 space-y-2">
                        <Skeleton className="h-4 w-full max-w-lg" />
                        <Skeleton className="h-4 w-3/4 max-w-md" />
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Skeleton className="h-9 w-36 rounded-xl" />
                        <Skeleton className="h-9 w-28 rounded-xl" />
                        <Skeleton className="h-9 w-28 rounded-xl" />
                        <Skeleton className="h-9 w-24 rounded-xl" />
                    </div>
                </div>
            </div>

            <DashboardCard className="overflow-hidden p-0">
                <div className="flex items-center justify-between border-b border-primary/10 px-5 py-4 sm:px-6">
                    <div className="space-y-1.5">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-9 w-32 rounded-xl" />
                </div>
                <div className="p-5 sm:p-6">
                    <MembersTableSkeleton />
                </div>
            </DashboardCard>

            <DashboardCard>
                <div className="space-y-1.5">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-44" />
                </div>
                <div className="mt-6 space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 rounded-2xl border border-border/50 p-4"
                        >
                            <Skeleton className="size-10 shrink-0 rounded-2xl" />
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-36" />
                                    <Skeleton className="h-4 w-16 rounded-full" />
                                </div>
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>
                    ))}
                </div>
            </DashboardCard>
        </DashboardShell>
    );
}

export function OrgErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <DashboardCard className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <span className="flex size-16 items-center justify-center rounded-3xl bg-destructive/12 ring-1 ring-destructive/25 text-destructive">
                <AlertTriangle className="size-7" />
            </span>
            <h2 className="mt-6 text-xl font-bold text-foreground">
                Could not load organization
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                This organization may not exist or you don't have access to it.
            </p>
            <Button
                type="button"
                variant="outline"
                className="mt-6 border-primary/20 hover:bg-primary/5"
                onClick={onRetry}
            >
                <RefreshCw className="size-4" />
                Try again
            </Button>
        </DashboardCard>
    );
}
