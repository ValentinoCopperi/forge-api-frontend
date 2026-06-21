import { useEffect, useState } from "react";
import type { OrganizationOfUserDto } from "@/shared/api/generated";
import { useOrganizationsControllerFindAllByUserId } from "@/shared/api/generated";
import { pathBuilder } from "@/shared/config/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Spinner } from "@/shared/ui/spinner";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { cn } from "@/shared/utils/utils";
import { Building2, Check, ChevronsUpDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { LAST_ORG_STORAGE_KEY } from "./sidebar.constants";
import { resolveSelectedOrganizationId } from "./sidebar.navigation";

function OrganizationAvatar({ organization }: { organization: OrganizationOfUserDto }) {
    const logoSrc = getAvatarSrc(organization.logoUrl);
    const initials = getInitials(organization.name);

    return (
        <Avatar className="size-9 shrink-0">
            {logoSrc ? (
                <AvatarImage src={logoSrc} alt={organization.name} />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {initials}
            </AvatarFallback>
        </Avatar>
    );
}

function WorkspaceSectionTitle() {
    return (
        <p className="px-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
            My organizations
        </p>
    );
}

function resolveStoredOrganizationId(
    organizations: OrganizationOfUserDto[]
): number | null {
    const storedOrgId = localStorage.getItem(LAST_ORG_STORAGE_KEY);

    if (!storedOrgId) {
        return null;
    }

    const parsedId = Number(storedOrgId);
    const matchedOrganization = organizations.find((org) => org.id === parsedId);

    if (!matchedOrganization) {
        localStorage.removeItem(LAST_ORG_STORAGE_KEY);
        return null;
    }

    return matchedOrganization.id;
}

/**
 * Selector de organización activa con listado desde la API.
 */
export function SidebarWorkspaceSwitcher() {
    const navigate = useNavigate();
    const { orgId: orgIdParam } = useParams();
    const [selectedOrganizationId, setSelectedOrganizationId] = useState<
        number | null
    >(null);

    const { data, isLoading, isError } = useOrganizationsControllerFindAllByUserId();

    const organizations = data?.data ?? [];

    const activeOrganization =
        organizations.find((org) => org.id === selectedOrganizationId) ?? null;

    useEffect(() => {
        if (organizations.length === 0) {
            return;
        }

        const organizationIdFromUrl = resolveSelectedOrganizationId(orgIdParam);

        if (organizationIdFromUrl) {
            const matchedOrganization = organizations.find(
                (org) => org.id === organizationIdFromUrl
            );

            setSelectedOrganizationId(matchedOrganization?.id ?? null);
            return;
        }

        setSelectedOrganizationId(resolveStoredOrganizationId(organizations));
    }, [organizations, orgIdParam]);

    const handleOrganizationSelect = (organizationId: number) => {
        setSelectedOrganizationId(organizationId);
        localStorage.setItem(LAST_ORG_STORAGE_KEY, String(organizationId));
        navigate(pathBuilder.org(organizationId));
    };

    if (isLoading) {
        return (
            <div className="space-y-1">
                <WorkspaceSectionTitle />
                <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                        <Spinner className="size-4 text-muted-foreground" />
                    </span>
                    <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">
                            Loading...
                        </span>
                        <span className="block text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                            Organizations
                        </span>
                    </span>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-1">
                <WorkspaceSectionTitle />
                <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
                    <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">
                            No organizations
                        </span>
                        <span className="block text-xs text-muted-foreground">
                            Could not load workspaces
                        </span>
                    </span>
                </div>
            </div>
        );
    }

    if (organizations.length === 0) {
        return (
            <div className="space-y-1">
                <WorkspaceSectionTitle />
                <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
                    <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-foreground">
                            No organizations
                        </span>
                        <span className="block text-xs text-muted-foreground">
                            No workspaces available
                        </span>
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <WorkspaceSectionTitle />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted/50 data-[state=open]:bg-muted/50"
                        aria-label={
                            activeOrganization
                                ? `Organization: ${activeOrganization.name}`
                                : "Select organization"
                        }
                    >
                        {activeOrganization ? (
                            <OrganizationAvatar organization={activeOrganization} />
                        ) : (
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                                <Building2 className="size-4 text-muted-foreground" />
                            </span>
                        )}

                        <span className="min-w-0 flex-1">
                            <span
                                className={cn(
                                    "block truncate text-sm font-semibold",
                                    activeOrganization
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {activeOrganization?.name ?? "Select organization"}
                            </span>
                            <span className="block text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                                Organization
                            </span>
                        </span>

                        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="start"
                    className="w-(--radix-dropdown-menu-trigger-width)"
                >
                    {organizations.map((organization) => {
                        const isSelected = organization.id === selectedOrganizationId;

                        return (
                            <DropdownMenuItem
                                key={organization.id}
                                onSelect={() =>
                                    handleOrganizationSelect(organization.id)
                                }
                                className="gap-3"
                            >
                                <OrganizationAvatar organization={organization} />

                                <span className="min-w-0 flex-1 truncate">
                                    {organization.name}
                                </span>

                                <Check
                                    className={cn(
                                        "size-4 shrink-0 text-primary",
                                        isSelected ? "opacity-100" : "opacity-0"
                                    )}
                                />
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
