import { cn } from "@/shared/utils/utils";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

const METHOD_STYLES: Record<HttpMethod, string> = {
    GET: "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    POST: "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    PATCH: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    DELETE: "border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

type TutorialMethodBadgeProps = {
    method: HttpMethod;
    className?: string;
};

export function TutorialMethodBadge({
    method,
    className,
}: TutorialMethodBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex shrink-0 rounded-lg border px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wide uppercase",
                METHOD_STYLES[method],
                className
            )}
        >
            {method}
        </span>
    );
}
