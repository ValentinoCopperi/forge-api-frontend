import { AlertTriangle, Building2 } from "lucide-react";
import { Spinner } from "@/shared/ui/spinner";
import { DashboardCard } from "./dashboard-card";

export function DashboardLoadingState() {
    return (
        <div className="grid min-h-[60vh] place-items-center">
            <DashboardCard className="flex w-full max-w-md flex-col items-center text-center">
                <span className="flex size-14 items-center justify-center rounded-3xl bg-primary/10">
                    <Spinner className="size-6 text-primary" />
                </span>
                <h1 className="mt-5 text-xl font-semibold text-foreground">
                    Preparing dashboard
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    We are fetching organizations, members, and projects from the
                    API.
                </p>
            </DashboardCard>
        </div>
    );
}

export function DashboardErrorState() {
    return (
        <div className="grid min-h-[60vh] place-items-center">
            <DashboardCard className="flex w-full max-w-md flex-col items-center text-center">
                <span className="flex size-14 items-center justify-center rounded-3xl bg-destructive/10 text-destructive">
                    <AlertTriangle className="size-6" />
                </span>
                <h1 className="mt-5 text-xl font-semibold text-foreground">
                    We could not load organizations
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Check your session or try again when the backend is available.
                </p>
            </DashboardCard>
        </div>
    );
}

export function DashboardEmptyState() {
    return (
        <div className="grid min-h-[60vh] place-items-center">
            <DashboardCard className="flex w-full max-w-lg flex-col items-center text-center">
                <span className="flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                    <Building2 className="size-7" />
                </span>
                <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                    There are no organizations yet
                </h1>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    When the backend returns organizations for your user, this panel
                    will show an executive summary, members, projects, roles, and
                    recent activity.
                </p>
            </DashboardCard>
        </div>
    );
}
