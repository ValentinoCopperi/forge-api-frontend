import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { pathBuilder } from "@/shared/config/routes";
import type { DashboardOrganization } from "@/features/dashboard/api/use-dashboard-data";
import { Skeleton } from "@/shared/ui/skeleton";

type SortKey = "name" | "memberCount" | "projectCount" | "activeCount";
type SortDir = "asc" | "desc";

function getActiveCount(org: DashboardOrganization): number {
    return org.projects.filter((p) => p.status === "ACTIVE").length;
}

function sortOrganizations(
    orgs: DashboardOrganization[],
    key: SortKey,
    dir: SortDir
): DashboardOrganization[] {
    return [...orgs].sort((a, b) => {
        let valA: string | number;
        let valB: string | number;

        switch (key) {
            case "name":
                valA = a.name.toLowerCase();
                valB = b.name.toLowerCase();
                break;
            case "memberCount":
                valA = a.memberCount;
                valB = b.memberCount;
                break;
            case "projectCount":
                valA = a.projectCount;
                valB = b.projectCount;
                break;
            case "activeCount":
                valA = getActiveCount(a);
                valB = getActiveCount(b);
                break;
            default:
                return 0;
        }

        if (typeof valA === "string" && typeof valB === "string") {
            return dir === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return dir === "asc"
            ? (valA as number) - (valB as number)
            : (valB as number) - (valA as number);
    });
}

type ColDef = {
    key: SortKey;
    label: string;
    align: "left" | "right";
};

const COLUMNS: ColDef[] = [
    { key: "name",        label: "Organization", align: "left"  },
    { key: "memberCount", label: "Members",      align: "right" },
    { key: "projectCount",label: "Projects",     align: "right" },
    { key: "activeCount", label: "Active",       align: "right" },
];

type DashboardOrgTableProps = {
    organizations: DashboardOrganization[];
    isLoading?: boolean;
};

export function DashboardOrgTable({
    organizations,
    isLoading,
}: DashboardOrgTableProps) {
    const [sortKey, setSortKey] = useState<SortKey>("name");
    const [sortDir, setSortDir] = useState<SortDir>("asc");

    const sorted = useMemo(
        () => sortOrganizations(organizations, sortKey, sortDir),
        [organizations, sortKey, sortDir]
    );

    function handleSort(key: SortKey) {
        if (key === sortKey) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    }

    return (
        <div className="dashboard-card-surface overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="dashboard-table-head border-b border-border/50">
                            {COLUMNS.map((col) => {
                                const isActive = col.key === sortKey;
                                const SortIcon = isActive
                                    ? sortDir === "asc"
                                        ? ArrowUp
                                        : ArrowDown
                                    : ArrowUpDown;

                                return (
                                    <th
                                        key={col.key}
                                        scope="col"
                                        className={cn(
                                            "px-5 py-3.5",
                                            col.align === "right" ? "text-right" : "text-left"
                                        )}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => handleSort(col.key)}
                                            className={cn(
                                                "inline-flex items-center gap-1.5 transition-colors hover:text-foreground",
                                                col.align === "right" && "flex-row-reverse w-full justify-start",
                                                isActive && "text-foreground"
                                            )}
                                        >
                                            {col.label}
                                            <SortIcon
                                                className={cn(
                                                    "size-3 shrink-0",
                                                    isActive ? "opacity-80" : "opacity-35"
                                                )}
                                            />
                                        </button>
                                    </th>
                                );
                            })}
                            <th
                                scope="col"
                                className="px-5 py-3.5 text-left"
                            >
                                Owner
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="border-t border-border/40">
                                    <td className="px-5 py-3.5">
                                        <Skeleton className="h-4 w-40" />
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <Skeleton className="ml-auto h-4 w-6" />
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <Skeleton className="ml-auto h-4 w-6" />
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <Skeleton className="ml-auto h-4 w-6" />
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <Skeleton className="h-4 w-28" />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            sorted.map((org) => {
                                const activeCount = getActiveCount(org);
                                const ownerName = org.creator?.name ?? "—";

                                return (
                                    <tr
                                        key={org.id}
                                        className="border-t border-border/40 transition-colors hover:bg-muted/40"
                                    >
                                        <td className="px-5 py-3.5">
                                            <Link
                                                to={pathBuilder.org(org.id)}
                                                className="font-medium text-foreground transition-colors hover:text-primary"
                                            >
                                                {org.name}
                                            </Link>
                                        </td>
                                        <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                                            {org.memberCount}
                                        </td>
                                        <td className="px-5 py-3.5 text-right tabular-nums text-muted-foreground">
                                            {org.projectCount}
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            {activeCount > 0 ? (
                                                <span className="tabular-nums font-medium text-chart-3">
                                                    {activeCount}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground/40">—</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5 text-muted-foreground">
                                            {ownerName}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
