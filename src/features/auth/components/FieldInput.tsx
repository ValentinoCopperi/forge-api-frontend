import { cn } from "@/shared/utils/utils";
import type { LucideIcon } from "lucide-react";

type FieldInputProps = React.ComponentProps<"input"> & {
    icon?: LucideIcon;
    endAdornment?: React.ReactNode;
    error?: string;
};

export function FieldInput({
    id,
    type = "text",
    placeholder,
    icon: Icon,
    endAdornment,
    error,
    className,
    ...props
}: FieldInputProps) {
    return (
        <div className="space-y-1.5">
            <div className="relative">
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    aria-invalid={Boolean(error)}
                    className={cn(
                        "h-11 w-full rounded-xl border bg-white/95 px-3 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/15",
                        Icon || endAdornment ? "pr-10" : undefined,
                        error ? "border-destructive/60" : "border-border/80",
                        className
                    )}
                    {...props}
                />
                {endAdornment ? (
                    <div className="absolute top-1/2 right-3 -translate-y-1/2">
                        {endAdornment}
                    </div>
                ) : Icon ? (
                    <Icon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                ) : null}
            </div>
            {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
    );
}
