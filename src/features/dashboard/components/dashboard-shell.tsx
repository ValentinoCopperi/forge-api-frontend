import type { ReactNode } from "react";
import { cn } from "@/shared/utils/utils";

type DashboardShellProps = {
    children: ReactNode;
    className?: string;
};

export function DashboardShell({ children, className }: DashboardShellProps) {
    return (
        <div
            className={cn(
                "flex w-full flex-col gap-6",
                className
            )}
        >
            {children}
        </div>
    );
}
