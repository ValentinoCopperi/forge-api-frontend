import { useHealthCheckApi } from "@/shared/api/api.health";
import { getApiErrorMessage } from "@/shared/api/utils/api-error.utils";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/utils/utils";
function StatusBadge({ value }: { value?: string }) {
    const isOk = value === "ok";

    return (
        <span
            className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium uppercase",
                isOk
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-destructive/10 text-destructive"
            )}
        >
            {value ?? "—"}
        </span>
    );
}

function HealthField({ label, value }: { label: string; value?: string }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3">
            <Label className="text-muted-foreground">{label}</Label>
            <StatusBadge value={value} />
        </div>
    );
}

export default function HomePage() {
    const { data: healthData, isLoading, isError, error, refetch, isFetching } =
        useHealthCheckApi();



    const health = healthData;

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-red-400 underline">Home</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>Loading API health...</span>
                </div>
            </div>
        );
    }

    if (isError) {

        const message = getApiErrorMessage(
            error,
            "Could not connect to the health check endpoint."
        );
    
        return (
            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-red-400 underline">Home</h1>
                <div className="max-w-md rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                    <p className="font-medium text-destructive">Error loading health check</p>
                    <p className="mt-1 text-sm text-muted-foreground">{message}</p>
                    <Button
                        className="mt-3"
                        variant="outline"
                        onClick={() => refetch()}
                        disabled={isFetching}
                    >
                        {isFetching ? "Retrying..." : "Retry"}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-red-400 underline">Home</h1>

            <section className="max-w-md rounded-lg border border-border bg-card p-4">
                <h2 className="mb-2 text-lg font-semibold">API Health</h2>

                <div className="divide-y divide-border">
                    <HealthField label="Status" value={health?.status} />
                    <HealthField label="Server" value={health?.server} />
                    <HealthField label="Database" value={health?.database} />
                    {/* <HealthField label="Redis" value={health?.redis} /> */}
                    <div className="flex items-center justify-between gap-4 py-3">
                        <Label className="text-muted-foreground">Timestamp</Label>
                        <span className="font-mono text-sm">{health?.timestamp ?? "—"}</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
