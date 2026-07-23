import {
    ArrowLeft,
    Building2,
    Calendar,
    Clock,
    ExternalLink,
    FolderKanban,
    Hash,
    RefreshCw,
    ShieldCheck,
    Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { OrganizationFindOneResponseDto } from "@/shared/api/generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { pathBuilder, paths, pathSegments } from "@/shared/config/routes";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { cn } from "@/shared/utils/utils";
import { formatOrganizationDate } from "@/features/organizations/utils/organizations.utils";

type OrgHeroProps = {
    org: OrganizationFindOneResponseDto;
    membersCount: number;
    projectsCount: number;
    isRefreshing: boolean;
    onRefresh: () => void;
};

export function OrgHero({
    org,
    membersCount,
    projectsCount,
    isRefreshing,
    onRefresh,
}: OrgHeroProps) {
    const creator = org.User_Organization_createdByUserIdToUser;
    const logoSrc = getAvatarSrc(org.logoUrl);
    const bannerSrc = getAvatarSrc(org.bannerUrl);
    const creatorAvatarSrc = getAvatarSrc(creator.avatarUrl);
    const organizationsPath = `${paths.dashboard}/${pathSegments.organizations}`;

    return (
        <header className="dashboard-hero-surface">
            {/* Banner */}
            <div className="relative h-32 sm:h-44">
                {bannerSrc ? (
                    <img
                        src={bannerSrc}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <>
                        <div className="h-full w-full bg-linear-to-br from-primary/25 via-chart-2/12 to-chart-3/18" />
                        <div className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-primary/20 blur-3xl" />
                        <div className="pointer-events-none absolute -bottom-12 -left-8 size-52 rounded-full bg-chart-2/15 blur-3xl" />
                    </>
                )}
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-card/80 via-card/10 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />

                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="absolute top-4 left-4 bg-background/75 backdrop-blur-sm hover:bg-background/90"
                >
                    <Link to={organizationsPath}>
                        <ArrowLeft className="size-4" />
                        Organizations
                    </Link>
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isRefreshing}
                    onClick={onRefresh}
                    className="absolute top-4 right-4 bg-background/75 backdrop-blur-sm hover:bg-background/90"
                >
                    <RefreshCw
                        className={cn("size-4", isRefreshing && "animate-spin")}
                    />
                    {isRefreshing ? "Refreshing…" : "Refresh"}
                </Button>
            </div>

            {/* Identity row */}
            <div className="px-6 sm:px-8">
                <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-end gap-4">
                        <Avatar className="size-20 shrink-0 rounded-3xl border-4 border-card shadow-xl shadow-primary/15 sm:size-24">
                            {logoSrc ? (
                                <AvatarImage
                                    src={logoSrc}
                                    alt={org.name}
                                    className="rounded-3xl"
                                />
                            ) : null}
                            <AvatarFallback className="rounded-3xl bg-primary/15 text-2xl font-bold text-primary">
                                {getInitials(org.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="pb-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/12 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase shadow-sm shadow-primary/10">
                                    <Building2 className="size-3" />
                                    Organization
                                </span>
                                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                                    <Hash className="size-3" />
                                    {org.id}
                                </span>
                            </div>
                            <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                {org.name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pb-1">
                        <Button asChild variant="outline" size="sm">
                            <Link to={pathBuilder.orgRoles(org.id)}>
                                <ShieldCheck className="size-4" />
                                Roles
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="sm"
                            className="shadow-md shadow-primary/20"
                        >
                            <Link to={pathBuilder.orgProjects(org.id)}>
                                <FolderKanban className="size-4" />
                                Projects
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Description + metadata */}
            <div className="px-6 pb-6 sm:px-8 sm:pb-8">
                {org.description ? (
                    <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">
                        {org.description}
                    </p>
                ) : (
                    <p className="mt-5 text-sm italic text-muted-foreground/50">
                        No description provided.
                    </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Link
                        to={pathBuilder.userProfile(creator.id)}
                        className="flex items-center gap-2.5 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs transition-colors hover:bg-muted/60"
                    >
                        <Avatar className="size-6 border border-border">
                            {creatorAvatarSrc ? (
                                <AvatarImage
                                    src={creatorAvatarSrc}
                                    alt={creator.name}
                                />
                            ) : null}
                            <AvatarFallback className="bg-muted text-[9px] font-bold text-muted-foreground">
                                {getInitials(creator.name)}
                            </AvatarFallback>
                        </Avatar>
                        <span>
                            <span className="font-semibold text-foreground">
                                {creator.name}
                            </span>
                            <span className="ml-1 text-muted-foreground">
                                · creator
                            </span>
                        </span>
                        <ExternalLink className="size-3 text-muted-foreground" />
                    </Link>

                    <span className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                        <Calendar className="size-3.5 shrink-0" />
                        <span>
                            Created{" "}
                            <span className="font-medium text-foreground">
                                {formatOrganizationDate(org.createdAt)}
                            </span>
                        </span>
                    </span>

                    <span className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                        <Clock className="size-3.5 shrink-0" />
                        <span>
                            Updated{" "}
                            <span className="font-medium text-foreground">
                                {formatOrganizationDate(org.updatedAt)}
                            </span>
                        </span>
                    </span>

                    <span className="flex items-center gap-1.5 rounded-xl border border-chart-2/30 bg-chart-2/8 px-3 py-2 text-xs text-chart-2">
                        <Users className="size-3.5 shrink-0" />
                        <span className="font-bold">{membersCount}</span>
                        <span className="text-chart-2/70">
                            {membersCount === 1 ? "member" : "members"}
                        </span>
                    </span>

                    <span className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/8 px-3 py-2 text-xs text-primary">
                        <FolderKanban className="size-3.5 shrink-0" />
                        <span className="font-bold">{projectsCount}</span>
                        <span className="text-primary/70">
                            {projectsCount === 1 ? "project" : "projects"}
                        </span>
                    </span>
                </div>
            </div>
        </header>
    );
}
