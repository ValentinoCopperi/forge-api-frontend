import type { SidebarNavGroupConfig } from "./sidebar.types";
import { SidebarNavItem } from "./sidebar-nav-item";

type SidebarNavGroupProps = {
    group: SidebarNavGroupConfig;
};

/**
 * Sección de navegación con etiqueta de grupo y lista de enlaces.
 */
export function SidebarNavGroup({ group }: SidebarNavGroupProps) {
    return (
        <div className="space-y-1">
            <p className="px-3 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                {group.label}
            </p>

            <nav className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                    <SidebarNavItem key={`${group.label}-${item.label}`} {...item} />
                ))}
            </nav>
        </div>
    );
}
