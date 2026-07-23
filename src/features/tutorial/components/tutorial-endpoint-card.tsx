import type { ReactNode } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { useEndpointRunner } from "../hooks/use-endpoint-runner";
import { TutorialMethodBadge } from "./tutorial-method-badge";
import { TutorialResponsePanel } from "./tutorial-response-panel";
import { cn } from "@/shared/utils/utils";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

type TutorialEndpointCardProps = {
    method: HttpMethod;
    path: string;
    title: string;
    description: string;
    note?: string;
    badge?: string;
    children?: ReactNode;
    onRun: () => Promise<unknown>;
    disabled?: boolean;
    runLabel?: string;
    destructive?: boolean;
    className?: string;
};

export function TutorialEndpointCard({
    method,
    path,
    title,
    description,
    note,
    badge,
    children,
    onRun,
    disabled = false,
    runLabel = "Try endpoint",
    destructive = false,
    className,
}: TutorialEndpointCardProps) {
    const runner = useEndpointRunner();

    const handleRun = () => {
        void runner.run(onRun);
    };

    return (
        <article
            className={cn(
                "rounded-3xl border border-border bg-card p-5 shadow-sm",
                className
            )}
        >
            <div className="flex flex-wrap items-start gap-3">
                <TutorialMethodBadge method={method} />
                <code className="min-w-0 flex-1 break-all rounded-xl bg-muted/50 px-3 py-1.5 font-mono text-xs text-foreground">
                    {path}
                </code>
                {badge ? (
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                        {badge}
                    </span>
                ) : null}
            </div>

            <div className="mt-4 space-y-2">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">
                    {description}
                </p>
                {note ? (
                    <p className="rounded-2xl border border-border/80 bg-muted/30 px-3 py-2 text-xs leading-5 text-muted-foreground">
                        {note}
                    </p>
                ) : null}
            </div>

            {children ? (
                <div className="mt-4 space-y-3 rounded-2xl border border-dashed border-border/80 bg-background/60 p-4">
                    {children}
                </div>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
                <Button
                    type="button"
                    variant={destructive ? "destructive" : "default"}
                    disabled={disabled || runner.isLoading}
                    onClick={handleRun}
                >
                    {runner.isLoading ? (
                        <Spinner className="size-4" />
                    ) : (
                        <Play className="size-4" />
                    )}
                    {runLabel}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    disabled={runner.isLoading && !runner.lastRunAt}
                    onClick={runner.reset}
                >
                    <RotateCcw className="size-4" />
                    Clear
                </Button>
            </div>

            <TutorialResponsePanel
                className="mt-4"
                data={runner.data}
                error={runner.error}
                isLoading={runner.isLoading}
                lastRunAt={runner.lastRunAt}
            />
        </article>
    );
}
