import { useLocation, useParams } from "react-router-dom";
import { isRouteWithoutSidebar } from "@/shared/config/routes";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarNavGroup } from "./sidebar-nav-group";
import { SidebarWorkspaceSwitcher } from "./sidebar-workspace-switcher";
import { SIDEBAR_NAV_GROUPS } from "./sidebar.mock";
import {
    getOrganizationNavGroup,
    resolveSelectedOrganizationId,
} from "./sidebar.navigation";
import { LAST_ORG_STORAGE_KEY } from "./sidebar.constants";
import type { SidebarNavGroupConfig } from "./sidebar.types";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/shared/utils/utils";

/**
 * Sidebar principal de la aplicación.
 * Layout vertical fijo con navegación agrupada y workspace switcher.
 * Usa datos mock — integrar API en una fase posterior.
 */
type AppSidebarProps = {
    collapsed?: boolean;
    mobileOpen?: boolean;
    onCollapsedChange?: () => void;
    onMobileClose?: () => void;
};

export function AppSidebar({
    collapsed = false,
    mobileOpen = false,
    onCollapsedChange,
    onMobileClose,
}: AppSidebarProps) {
    const location = useLocation();
    const { orgId: orgIdParam, projectId: projectIdParam } = useParams();

    const selectedOrganizationId =
        resolveSelectedOrganizationId(orgIdParam) ??
        resolveSelectedOrganizationId(
            localStorage.getItem(LAST_ORG_STORAGE_KEY) ?? undefined
        );

    const navGroups: SidebarNavGroupConfig[] = [
        ...SIDEBAR_NAV_GROUPS,
        ...(selectedOrganizationId
            ? [getOrganizationNavGroup(selectedOrganizationId, projectIdParam)]
            : []),
    ];

    // Ocultar sidebar en rutas de autenticación (login, register)
    if (isRouteWithoutSidebar(location.pathname)) {
        return null;
    }

    return (
        <>
            <button
                type="button"
                aria-label="Close navigation"
                onClick={onMobileClose}
                className={cn(
                    "fixed inset-0 z-40 bg-black/45 transition-opacity duration-200 lg:hidden",
                    mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                )}
            />

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
                    "w-(--sidebar-width) transition-[width,transform] duration-300 ease-out",
                    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
                    collapsed && "lg:w-(--sidebar-width-collapsed)"
                )}
            >
            <div className={cn("flex h-16 items-center border-b border-sidebar-border px-4", collapsed && "lg:justify-center lg:px-2")}>
                <SidebarBrand collapsed={collapsed} />
                <button
                    type="button"
                    onClick={onMobileClose}
                    className="ml-auto flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
                    aria-label="Close navigation"
                >
                    <X className="size-4" />
                </button>
            </div>

            <div className={cn("border-b border-sidebar-border px-3 py-4", collapsed && "lg:hidden")}>
                <SidebarWorkspaceSwitcher />
            </div>

            <div className={cn("flex-1 space-y-6 overflow-y-auto px-3 py-5", collapsed && "lg:px-2")}>
                {navGroups.map((group) => (
                    <SidebarNavGroup
                        key={group.label}
                        group={group}
                        collapsed={collapsed}
                        onNavigate={onMobileClose}
                    />
                ))}
            </div>

            <div className="border-t border-sidebar-border p-3">
                <button
                    type="button"
                    onClick={onCollapsedChange}
                    className={cn(
                        "hidden h-9 w-full items-center gap-2 rounded-md px-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:flex",
                        collapsed && "justify-center px-0"
                    )}
                    aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
                >
                    {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
                    {!collapsed ? <span>Collapse navigation</span> : null}
                </button>
                {!collapsed ? (
                    <p className="mt-3 px-2 text-[10px] leading-4 text-sidebar-foreground/45">
                        Engineered by{" "}
                        <a
                            href="https://valentinocopperi.com"
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-sidebar-foreground/70 transition-colors hover:text-primary"
                        >
                            Valentino Copperi
                        </a>
                    </p>
                ) : null}
            </div>
            </aside>
        </>
    );
}
