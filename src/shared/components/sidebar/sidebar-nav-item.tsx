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
};

type Icon = LucideIcon;

function NavItemContent({
    label,
    icon: Icon,
    badgeCount,
    isActive,
}: {
    label: string;
    icon: Icon;
    badgeCount?: number;
    isActive: boolean;
}) {
    return (
        <>
            {isActive ? (
                <span
                    className="absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                    aria-hidden
                />
            ) : null}

            <Icon
                className={cn(
                    "size-4 shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground"
                )}
            />

            <span className="flex-1 truncate">{label}</span>

            {badgeCount !== undefined ? (
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
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
                className="group relative flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/40"
            >
                <NavItemContent
                    label={label}
                    icon={Icon}
                    badgeCount={badgeCount}
                    isActive={false}
                />
            </span>
        );
    }

    return (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) => {
                const active = resolveIsActive(isActive);

                return cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/80 hover:bg-muted hover:text-foreground"
                );
            }}
        >
            {({ isActive }) => (
                <NavItemContent
                    label={label}
                    icon={Icon}
                    badgeCount={badgeCount}
                    isActive={resolveIsActive(isActive)}
                />
            )}
        </NavLink>
    );
}
