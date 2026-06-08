import { cn } from "@/shared/utils/utils";
import { ChevronDown } from "lucide-react";

type FieldSelectProps = React.ComponentProps<"select"> & {
    error?: string;
};

export function FieldSelect({ error, className, children, ...props }: FieldSelectProps) {
    return (
        <div className="space-y-1.5">
            <div className="relative">
                <select
                    aria-invalid={Boolean(error)}
                    className={cn(
                        "h-11 w-full appearance-none rounded-xl border bg-white/95 px-3 pr-10 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/15",
                        error ? "border-destructive/60" : "border-border/80",
                        className
                    )}
                    {...props}
                >
                    {children}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
    );
}
