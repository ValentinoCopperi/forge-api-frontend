import {
    ArrowLeft,
    Calendar,
    Clock,
    ExternalLink,
    FolderKanban,
    Hash,
    Pencil,
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
    onEdit: () => void;
    canEdit: boolean;
};

export function OrgHero({
    org,
    membersCount,
    projectsCount,
    isRefreshing,
    onRefresh,
    onEdit,
    canEdit,
}: OrgHeroProps) {
    const creator = org.User_Organization_createdByUserIdToUser;
    const logoSrc = getAvatarSrc(org.logoUrl);
    const bannerSrc = getAvatarSrc(org.bannerUrl);
    const creatorAvatarSrc = getAvatarSrc(creator.avatarUrl);
    const organizationsPath = `${paths.dashboard}/${pathSegments.organizations}`;

    return (
        <header className="dashboard-hero-surface overflow-hidden">
            {/* Banner */}
            <div className="relative h-24 bg-muted sm:h-32">
                {bannerSrc ? (
                    <img
                        src={bannerSrc}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : null}

                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="absolute top-4 left-4 border-border/80 bg-background/80 backdrop-blur-sm hover:bg-background"
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
                    className="absolute top-4 right-4 border-border/80 bg-background/80 backdrop-blur-sm hover:bg-background"
                >
                    <RefreshCw
                        className={cn("size-4", isRefreshing && "animate-spin")}
                    />
                    {isRefreshing ? "Refreshing…" : "Refresh"}
                </Button>
            </div>

            {/* Identity row */}
            <div className="px-6 sm:px-8">
                <div className="-mt-10 flex flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-end gap-4">
                        <Avatar className="size-20 shrink-0 rounded-2xl border-4 border-card shadow-sm sm:size-24">
                            {logoSrc ? (
                                <AvatarImage
                                    src={logoSrc}
                                    alt={org.name}
                                    className="rounded-2xl"
                                />
                            ) : null}
                            <AvatarFallback className="rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                                {getInitials(org.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="pb-1">
                            <div className="eyebrow">
                                <Hash className="size-3" />
                                Organization {org.id}
                            </div>
                            <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                {org.name}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pb-1">
                        {canEdit ? (
                            <Button type="button" variant="outline" size="sm" onClick={onEdit}>
                                <Pencil className="size-4" />
                                Edit
                            </Button>
                        ) : null}
                        <Button asChild variant="outline" size="sm">
                            <Link to={pathBuilder.orgRoles(org.id)}>
                                <ShieldCheck className="size-4" />
                                Roles
                            </Link>
                        </Button>
                        <Button asChild size="sm">
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
                    <p className="mt-5 text-sm italic text-muted-foreground/60">
                        No description provided.
                    </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-2">
                    <Link
                        to={pathBuilder.userProfile(creator.id)}
                        className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs transition-colors hover:bg-muted/60"
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

                    <span className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                        <Calendar className="size-3.5 shrink-0" />
                        <span>
                            Created{" "}
                            <span className="font-medium text-foreground">
                                {formatOrganizationDate(org.createdAt)}
                            </span>
                        </span>
                    </span>

                    <span className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                        <Clock className="size-3.5 shrink-0" />
                        <span>
                            Updated{" "}
                            <span className="font-medium text-foreground">
                                {formatOrganizationDate(org.updatedAt)}
                            </span>
                        </span>
                    </span>

                    <span className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                        <Users className="size-3.5 shrink-0" />
                        <span className="font-semibold text-foreground">
                            {membersCount}
                        </span>
                        {membersCount === 1 ? "member" : "members"}
                    </span>

                    <span className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                        <FolderKanban className="size-3.5 shrink-0" />
                        <span className="font-semibold text-foreground">
                            {projectsCount}
                        </span>
                        {projectsCount === 1 ? "project" : "projects"}
                    </span>
                </div>
            </div>
        </header>
    );
}
