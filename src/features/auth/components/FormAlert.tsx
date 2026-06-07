import { cn } from "@/shared/utils/utils";
import { AlertCircle } from "lucide-react";

type FormAlertProps = {
    message: string;
    variant?: "error" | "info";
};

export function FormAlert({ message, variant = "error" }: FormAlertProps) {
    return (
        <div
            role={variant === "error" ? "alert" : "status"}
            className={cn(
                "flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm",
                variant === "error"
                    ? "border-destructive/30 bg-destructive/5 text-destructive"
                    : "border-border bg-muted/50 text-muted-foreground"
            )}
        >
            {variant === "error" ? (
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
            ) : null}
            <p>{message}</p>
        </div>
    );
}
