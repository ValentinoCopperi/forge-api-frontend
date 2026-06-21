import { Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { paths } from "@/shared/config/routes";

/**
 * Cabecera del sidebar con logo y nombre de la marca.
 */
export function SidebarBrand() {
    return (
        <Link
            to={paths.home}
            className="flex items-center gap-2.5 px-1 transition-opacity hover:opacity-90"
        >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Zap className="size-4" />
            </span>
            <span className="min-w-0">
                <span className="block text-base font-bold tracking-tight text-foreground">
                    Forge
                </span>
                <span className="block text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    Workspace
                </span>
            </span>
        </Link>
    );
}
