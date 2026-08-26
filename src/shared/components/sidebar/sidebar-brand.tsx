import { Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { paths } from "@/shared/config/routes";

/**
 * Cabecera del sidebar con logo y nombre de la marca.
 */
export function SidebarBrand({ collapsed = false }: { collapsed?: boolean }) {
    return (
        <Link
            to={paths.home}
            className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90"
            aria-label="Forge home"
        >
            <span className="relative flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Zap className="size-4.5" />
                <span className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full border-2 border-sidebar bg-forge-lime" aria-hidden />
            </span>
            <span className={collapsed ? "lg:hidden" : "min-w-0"}>
                <span className="block text-[15px] font-extrabold tracking-[-0.025em] text-sidebar-foreground">
                    Forge
                </span>
                <span className="block text-[9px] font-bold tracking-[0.14em] text-muted-foreground uppercase">
                    Control room
                </span>
            </span>
        </Link>
    );
}
