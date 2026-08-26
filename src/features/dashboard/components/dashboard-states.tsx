import { AlertTriangle, Building2 } from "lucide-react";
import { Spinner } from "@/shared/ui/spinner";
import { DashboardCard } from "./dashboard-card";
import { DashboardHero } from "./dashboard-hero";

export function DashboardLoadingState() {
    return (
        <DashboardCard className="flex min-h-[50vh] w-full flex-col items-center justify-center text-center">
            <span className="flex size-14 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Spinner className="size-7 text-primary" />
            </span>
            <h1 className="mt-6 text-xl font-bold text-foreground">
                Preparing dashboard
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Fetching organizations, members, and projects from the API.
            </p>
        </DashboardCard>
    );
}

export function DashboardErrorState() {
    return (
        <DashboardCard className="flex min-h-[50vh] w-full flex-col items-center justify-center text-center">
            <span className="flex size-14 items-center justify-center rounded-xl bg-danger-soft text-destructive">
                <AlertTriangle className="size-7" />
            </span>
            <h1 className="mt-6 text-xl font-bold text-foreground">
                We could not load organizations
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                Check your session or try again when the backend is available.
            </p>
        </DashboardCard>
    );
}

export function DashboardEmptyState() {
    return (
        <div className="space-y-6">
            <DashboardHero
                badge={{ icon: Building2, label: "Getting started" }}
                title="Welcome to Forge"
                description="When the backend returns organizations for your user, this panel will show an executive summary, members, projects, roles, and recent activity."
            />
            <DashboardCard className="flex min-h-[40vh] flex-col items-center justify-center text-center">
                <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/15 text-primary">
                    <Building2 className="size-7" />
                </span>
                <h2 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
                    No organizations yet
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    Create your first workspace from the Organizations page or
                    complete the tutorial to get started.
                </p>
            </DashboardCard>
        </div>
    );
}
