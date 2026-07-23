import { DashboardCard } from "@/features/dashboard/components/dashboard-card";
import { Skeleton } from "@/shared/ui/skeleton";

function StatCardSkeleton() {
    return (
        <DashboardCard className="relative overflow-hidden">
            <div className="absolute -top-10 -right-10 size-28 rounded-full bg-muted/40" />
            <div className="relative flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-16" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="size-11 shrink-0 rounded-2xl" />
            </div>
            <Skeleton className="relative mt-5 h-3 w-32" />
        </DashboardCard>
    );
}

function TableRowSkeleton() {
    return (
        <tr className="border-b border-border/70 last:border-b-0">
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="size-11 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-48" />
                        <Skeleton className="h-2.5 w-14" />
                    </div>
                </div>
            </td>
            <td className="px-5 py-4">
                <Skeleton className="h-6 w-16 rounded-full" />
            </td>
            <td className="px-5 py-4">
                <div className="flex items-center gap-2.5">
                    <Skeleton className="size-8 shrink-0 rounded-full" />
                    <div className="space-y-1.5">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
            </td>
            <td className="px-5 py-4 text-center">
                <Skeleton className="mx-auto h-7 w-10 rounded-full" />
            </td>
            <td className="px-5 py-4 text-center">
                <Skeleton className="mx-auto h-7 w-10 rounded-full" />
            </td>
            <td className="px-5 py-4">
                <Skeleton className="h-4 w-20" />
            </td>
            <td className="px-5 py-4">
                <Skeleton className="h-4 w-20" />
            </td>
            <td className="px-5 py-4">
                <div className="flex justify-end gap-2">
                    <Skeleton className="hidden h-8 w-20 rounded-xl sm:block" />
                    <Skeleton className="hidden h-8 w-16 rounded-xl sm:block" />
                    <Skeleton className="size-8 rounded-xl" />
                </div>
            </td>
        </tr>
    );
}

export function OrganizationsPageSkeleton() {
    return (
        <>
            <section className="grid gap-5 md:grid-cols-3">
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
            </section>

            <DashboardCard className="overflow-hidden p-0">
                <div className="flex items-center justify-between gap-4 border-b border-primary/10 bg-linear-to-r from-primary/6 to-transparent px-5 py-4 sm:px-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-56" />
                    </div>
                    <Skeleton className="h-9 w-24 rounded-xl" />
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                    <Skeleton className="h-11 max-w-sm rounded-xl" />

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[960px] border-collapse">
                            <thead>
                                <tr className="border-b border-primary/10 dashboard-table-head">
                                    {Array.from({ length: 8 }).map((_, index) => (
                                        <th key={index} className="px-5 py-3">
                                            <Skeleton className="h-3 w-16" />
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <TableRowSkeleton key={index} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </DashboardCard>
        </>
    );
}
