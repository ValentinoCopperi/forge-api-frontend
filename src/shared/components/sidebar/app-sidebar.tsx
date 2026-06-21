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

/**
 * Sidebar principal de la aplicación.
 * Layout vertical fijo con navegación agrupada y workspace switcher.
 * Usa datos mock — integrar API en una fase posterior.
 */
export function AppSidebar() {
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
        <aside className="fixed inset-y-0 left-0 z-30 flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
            {/* ── Cabecera: marca ── */}
            <div className="px-4 pt-5 pb-4">
                <SidebarBrand />
            </div>

            {/* ── Workspace activo ── */}
            <div className="px-3 pb-4">
                <SidebarWorkspaceSwitcher />
            </div>

            {/* ── Navegación principal (scrollable) ── */}
            <div className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
                {navGroups.map((group) => (
                    <SidebarNavGroup key={group.label} group={group} />
                ))}
            </div>

            <div className="border-t border-sidebar-border px-4 py-4 text-xs text-sidebar-foreground/60">
                Developed by{" "}
                <a
                    href="https://valentinocopperi.com"
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-sidebar-foreground underline underline-offset-4 transition-colors hover:text-primary"
                >
                    Valentino Copperi
                </a>
            </div>
        </aside>
    );
}
