import type { SidebarNavGroupConfig } from "./sidebar.types";
import { SidebarNavItem } from "./sidebar-nav-item";

type SidebarNavGroupProps = {
    group: SidebarNavGroupConfig;
    collapsed?: boolean;
    onNavigate?: () => void;
};

/**
 * Sección de navegación con etiqueta de grupo y lista de enlaces.
 */
export function SidebarNavGroup({ group, collapsed = false, onNavigate }: SidebarNavGroupProps) {
    return (
        <div className="space-y-1.5">
            <p className={collapsed ? "sr-only lg:not-sr-only lg:h-px lg:bg-sidebar-border lg:text-transparent" : "px-2 text-[9px] font-bold tracking-[0.14em] text-muted-foreground uppercase"}>
                <span className={collapsed ? "lg:hidden" : undefined}>{group.label}</span>
            </p>

            <nav className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                    <SidebarNavItem key={`${group.label}-${item.label}`} {...item} collapsed={collapsed} onNavigate={onNavigate} />
                ))}
            </nav>
        </div>
    );
}
