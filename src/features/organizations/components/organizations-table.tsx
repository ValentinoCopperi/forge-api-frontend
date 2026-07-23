import { Link } from "react-router-dom";
import {
    ArrowUpRight,
    ExternalLink,
    FolderKanban,
    MoreHorizontal,
    Search,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import { FieldInput } from "@/features/auth/components/FieldInput";
import { pathBuilder } from "@/shared/config/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { cn } from "@/shared/utils/utils";
import { formatOrganizationDate } from "../utils/organizations.utils";
import type { OrganizationTableRow } from "../types/organization-table.types";
import { OrganizationRoleBadge } from "./organization-role-badge";

type OrganizationsTableProps = {
    organizations: OrganizationTableRow[];
    totalCount: number;
    search: string;
    onSearchChange: (value: string) => void;
    activeOrganizationId?: number | null;
    isRefreshing?: boolean;
    showMembershipRole?: boolean;
    hasActiveFilters?: boolean;
    emptyMessage?: string;
};

export function OrganizationsTable({
    organizations,
    totalCount,
    search,
    onSearchChange,
    activeOrganizationId,
    isRefreshing,
    showMembershipRole = true,
    hasActiveFilters = false,
    emptyMessage = "No organizations to display.",
}: OrganizationsTableProps) {
    const noDataAtAll = totalCount === 0;
    const noMatches = !noDataAtAll && organizations.length === 0;

    const emptyStateMessage = noDataAtAll
        ? emptyMessage
        : hasActiveFilters
          ? "No organizations match your search or filters."
          : "No organizations to display.";

    return (
        <div
            className={cn(
                "space-y-4 transition-opacity",
                isRefreshing && "opacity-70"
            )}
        >
            <div className="max-w-sm">
                <FieldInput
                    icon={Search}
                    placeholder="Search by name, role, or creator..."
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    aria-label="Search organizations"
                />
            </div>

            {noDataAtAll || noMatches ? (
                <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-6 py-14 text-center">
                    <p className="text-sm font-medium text-foreground">
                        {emptyStateMessage}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[960px] border-collapse text-left">
                        <thead>
                            <tr className="border-b border-primary/10 dashboard-table-head">
                                <TableHead>Organization</TableHead>
                                {showMembershipRole ? (
                                    <TableHead>Your role</TableHead>
                                ) : null}
                                <TableHead>Created by</TableHead>
                                <TableHead className="text-center">Members</TableHead>
                                <TableHead className="text-center">Projects</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Updated</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </tr>
                        </thead>
                        <tbody>
                            {organizations.map((organization) => (
                                <OrganizationRow
                                    key={organization.id}
                                    organization={organization}
                                    isActive={
                                        organization.id === activeOrganizationId
                                    }
                                    showMembershipRole={showMembershipRole}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function TableHead({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <th
            className={cn(
                "px-5 py-3.5 text-[11px] font-bold tracking-wider uppercase",
                className
            )}
        >
            {children}
        </th>
    );
}

function OrganizationRow({
    organization,
    isActive,
    showMembershipRole,
}: {
    organization: OrganizationTableRow;
    isActive?: boolean;
    showMembershipRole?: boolean;
}) {
    const creator = organization.creator;
    const logoSrc = getAvatarSrc(organization.logoUrl);
    const creatorAvatarSrc = getAvatarSrc(creator.avatarUrl);

    return (
        <tr
            className={cn(
                "group border-b border-border/60 transition-colors last:border-b-0 odd:bg-muted/20 even:bg-card hover:bg-primary/5",
                isActive &&
                    "border-l-[3px] border-l-primary bg-linear-to-r from-primary/10 via-primary/5 to-transparent shadow-[inset_0_0_0_1px_oklch(0.52_0.19_275/0.12)] hover:from-primary/12"
            )}
        >
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <Avatar className="size-11 border border-border shadow-sm">
                        {logoSrc ? (
                            <AvatarImage
                                src={logoSrc}
                                alt={organization.name}
                            />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                            {getInitials(organization.name)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                to={pathBuilder.org(organization.id)}
                                className="inline-flex items-center gap-1 truncate text-sm font-semibold text-foreground transition-colors hover:text-primary"
                            >
                                {organization.name}
                                <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                            </Link>
                            {isActive ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-primary/35 bg-primary/15 px-2 py-0.5 text-[10px] font-bold tracking-wide text-primary uppercase shadow-sm shadow-primary/15">
                                    <Sparkles className="size-3" />
                                    Active
                                </span>
                            ) : null}
                        </div>
                        <p className="mt-0.5 line-clamp-1 max-w-xs text-xs text-muted-foreground">
                            {organization.description ??
                                "No description provided"}
                        </p>
                        <p className="mt-1 font-mono text-[10px] text-muted-foreground/80">
                            ID #{organization.id}
                        </p>
                    </div>
                </div>
            </td>

            {showMembershipRole ? (
                <td className="px-5 py-4">
                    {organization.role ? (
                        <OrganizationRoleBadge role={organization.role} />
                    ) : (
                        <span className="inline-flex rounded-full border border-muted-foreground/20 bg-muted/50 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                            Not a member
                        </span>
                    )}
                </td>
            ) : null}

            <td className="px-5 py-4">
                <Link
                    to={pathBuilder.userProfile(creator.id)}
                    className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
                >
                    <Avatar className="size-8 border border-border">
                        {creatorAvatarSrc ? (
                            <AvatarImage
                                src={creatorAvatarSrc}
                                alt={creator.name}
                            />
                        ) : null}
                        <AvatarFallback className="bg-muted text-[11px] font-semibold text-muted-foreground">
                            {getInitials(creator.name)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="min-w-0">
                        <span className="flex items-center gap-1 truncate text-sm font-medium text-foreground">
                            {creator.name}
                            <ExternalLink className="size-3 shrink-0 text-muted-foreground" />
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                            {creator.email}
                        </span>
                    </span>
                </Link>
            </td>

            <td className="px-5 py-4 text-center">
                <CountPill value={organization.counts.OrganizationUser} />
            </td>

            <td className="px-5 py-4 text-center">
                <CountPill value={organization.counts.Project} />
            </td>

            <td className="px-5 py-4 text-sm text-muted-foreground">
                {formatOrganizationDate(organization.createdAt)}
            </td>

            <td className="px-5 py-4 text-sm text-muted-foreground">
                {formatOrganizationDate(organization.updatedAt)}
            </td>

            <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                        <Link to={pathBuilder.orgProjects(organization.id)}>
                            <FolderKanban />
                            Projects
                        </Link>
                    </Button>
                    <Button asChild size="sm" className="hidden sm:inline-flex">
                        <Link to={pathBuilder.org(organization.id)}>Open</Link>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon-sm"
                                aria-label={`Actions for ${organization.name}`}
                            >
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem asChild>
                                <Link to={pathBuilder.org(organization.id)}>
                                    Open organization
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to={pathBuilder.orgProjects(organization.id)}>
                                    <FolderKanban />
                                    View projects
                                </Link>
                            </DropdownMenuItem>
                            {organization.isMember ? (
                                <DropdownMenuItem asChild>
                                    <Link to={pathBuilder.orgRoles(organization.id)}>
                                        <ShieldCheck />
                                        Manage roles
                                    </Link>
                                </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link to={pathBuilder.userProfile(creator.id)}>
                                    View creator profile
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </td>
        </tr>
    );
}

function CountPill({ value }: { value: number }) {
    return (
        <span className="inline-flex min-w-10 items-center justify-center rounded-full border border-chart-2/25 bg-chart-2/10 px-2.5 py-1 text-sm font-bold text-chart-2">
            {value}
        </span>
    );
}
