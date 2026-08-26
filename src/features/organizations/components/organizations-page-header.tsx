import { Building2, Plus, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { DashboardHero } from "@/features/dashboard";
import { Button } from "@/shared/ui/button";
import { GlobalRoleBadge } from "./global-role-badge";
import {
    canCreateOrganization,
    normalizeUserRoles,
} from "../utils/organizations.utils";

type OrganizationsPageHeaderProps = {
    onCreateClick: () => void;
    isLoading?: boolean;
};

export function OrganizationsPageHeader({
    onCreateClick,
    isLoading,
}: OrganizationsPageHeaderProps) {
    const user = useAuthStore((state) => state.user);

    const userRoles = normalizeUserRoles(user?.roles);
    const primaryRole = userRoles[0];
    const isDirector = canCreateOrganization(user?.roles);

    return (
        <DashboardHero
            badge={{ icon: Building2, label: "Workspace directory" }}
            title="Organizations"
            description="Manage the workspaces you belong to. Review your role, members, projects, and ownership details in one place."
            meta={
                user ? (
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-background/80 px-3.5 py-2 text-sm shadow-sm backdrop-blur-sm">
                            <ShieldCheck className="size-4 text-primary" />
                            <span className="font-medium text-muted-foreground">
                                Global role
                            </span>
                            {primaryRole ? (
                                <GlobalRoleBadge role={primaryRole} />
                            ) : (
                                <span className="font-semibold text-foreground">
                                    User
                                </span>
                            )}
                        </span>
                        {!isDirector ? (
                            <span className="rounded-lg bg-chart-4/10 px-2.5 py-1 text-xs font-medium text-chart-4">
                                Only directors can create organizations
                            </span>
                        ) : null}
                    </div>
                ) : null
            }
            action={
                <Button
                    type="button"
                    size="lg"
                    className="h-10 rounded-md px-4 shadow-sm"
                    disabled={!isDirector || isLoading}
                    onClick={onCreateClick}
                >
                    <Plus />
                    Create organization
                </Button>
            }
        />
    );
}
