import { AlertTriangle, Building2, Plus, RefreshCw } from "lucide-react";
import { DashboardCard } from "@/features/dashboard/components/dashboard-card";
import { Button } from "@/shared/ui/button";

type OrganizationsEmptyStateProps = {
    onCreateClick?: () => void;
    canCreate?: boolean;
};

type OrganizationsErrorStateProps = {
    onRetry?: () => void;
};

export function OrganizationsErrorState({
    onRetry,
}: OrganizationsErrorStateProps) {
    return (
        <DashboardCard className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <span className="flex size-14 items-center justify-center rounded-xl bg-danger-soft text-destructive">
                <AlertTriangle className="size-7" />
            </span>
            <h2 className="mt-6 text-xl font-bold text-foreground">
                Could not load organizations
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Check your session or try again when the backend is available.
            </p>
            {onRetry ? (
                <Button
                    type="button"
                    variant="outline"
                    className="mt-6 border-primary/20 hover:bg-primary/5"
                    onClick={onRetry}
                >
                    <RefreshCw className="size-4" />
                    Try again
                </Button>
            ) : null}
        </DashboardCard>
    );
}

export function OrganizationsEmptyState({
    onCreateClick,
    canCreate,
}: OrganizationsEmptyStateProps) {
    return (
        <DashboardCard className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15 text-primary">
                <Building2 className="size-7" />
            </span>
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
                No organizations yet
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                You are not part of any workspace. Create one to start managing
                projects, members, and roles.
            </p>
            {canCreate && onCreateClick ? (
                <Button
                    type="button"
                    size="lg"
                    className="mt-6 shadow-sm"
                    onClick={onCreateClick}
                >
                    <Plus />
                    Create organization
                </Button>
            ) : null}
        </DashboardCard>
    );
}
