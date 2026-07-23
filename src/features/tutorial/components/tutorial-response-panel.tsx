import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { formatResponsePayload } from "../utils/format-response.utils";
import { cn } from "@/shared/utils/utils";

type TutorialResponsePanelProps = {
    data: unknown;
    error: string | null;
    isLoading: boolean;
    lastRunAt: Date | null;
    className?: string;
};

export function TutorialResponsePanel({
    data,
    error,
    isLoading,
    lastRunAt,
    className,
}: TutorialResponsePanelProps) {
    const hasResult = Boolean(lastRunAt);
    const isSuccess = hasResult && !error;

    return (
        <div
            className={cn(
                "overflow-hidden rounded-2xl border border-border bg-muted/20",
                className
            )}
        >
            <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Response
                </p>
                {isLoading ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock3 className="size-3.5 animate-pulse" />
                        Running...
                    </span>
                ) : isSuccess ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5" />
                        Success
                    </span>
                ) : hasResult ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive">
                        <XCircle className="size-3.5" />
                        Error
                    </span>
                ) : (
                    <span className="text-xs text-muted-foreground">
                        Run an endpoint to see the result
                    </span>
                )}
            </div>

            <pre className="max-h-72 overflow-auto p-4 font-mono text-xs leading-6 text-foreground/90">
                {isLoading
                    ? "Waiting for the API..."
                    : error
                      ? error
                      : hasResult
                        ? formatResponsePayload(data)
                        : "{ }"}
            </pre>
        </div>
    );
}
