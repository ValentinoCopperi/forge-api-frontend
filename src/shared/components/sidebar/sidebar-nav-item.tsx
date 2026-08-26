import type { LucideIcon } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/shared/utils/utils";

type SidebarNavItemProps = {
    to: string;
    label: string;
    icon: Icon;
    badgeCount?: number;
    end?: boolean;
    disabled?: boolean;
    isActive?: (pathname: string) => boolean;
    collapsed?: boolean;
    onNavigate?: () => void;
};

type Icon = LucideIcon;

function NavItemContent({
    label,
    icon: Icon,
    badgeCount,
    isActive,
    collapsed,
}: {
    label: string;
    icon: Icon;
    badgeCount?: number;
    isActive: boolean;
    collapsed?: boolean;
}) {
    return (
        <>
            <Icon
                className={cn(
                    "size-4 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground"
                )}
            />

            <span className={cn("flex-1 truncate", collapsed && "lg:hidden")}>{label}</span>

            {badgeCount !== undefined && !collapsed ? (
                <span className="flex min-w-5 shrink-0 items-center justify-center rounded-full bg-muted px-1.5 text-[10px] font-bold text-muted-foreground">
                    {badgeCount}
                </span>
            ) : null}
        </>
    );
}

/**
 * Enlace de navegación individual con estado activo, icono y badge opcional.
 */
export function SidebarNavItem({
    to,
    label,
    icon: Icon,
    badgeCount,
    end,
    disabled,
    isActive: isActiveMatch,
    collapsed = false,
    onNavigate,
}: SidebarNavItemProps) {
    const location = useLocation();

    const resolveIsActive = (routerActive: boolean) =>
        isActiveMatch
            ? isActiveMatch(location.pathname) || routerActive
            : routerActive;

    if (disabled) {
        return (
            <span
                aria-disabled
                className={cn("group relative flex cursor-not-allowed items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium text-foreground/40", collapsed && "lg:justify-center lg:px-0")}
            >
                <NavItemContent
                    label={label}
                    icon={Icon}
                    badgeCount={badgeCount}
                    isActive={false}
                    collapsed={collapsed}
                />
            </span>
        );
    }

    return (
        <NavLink
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            onClick={onNavigate}
            className={({ isActive }) => {
                const active = resolveIsActive(isActive);

                return cn(
                    "group relative flex min-h-9 items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-semibold transition-colors",
                    collapsed && "lg:justify-center lg:px-0",
                    active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/72 hover:bg-sidebar-accent/65 hover:text-sidebar-foreground"
                );
            }}
        >
            {({ isActive }) => (
                <NavItemContent
                    label={label}
                    icon={Icon}
                    badgeCount={badgeCount}
                    isActive={resolveIsActive(isActive)}
                    collapsed={collapsed}
                />
            )}
        </NavLink>
    );
}
