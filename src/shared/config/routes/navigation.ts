import { Home, LayoutDashboard, type LucideIcon } from "lucide-react";
import { paths, type AppPath } from "./paths";

export type MainNavItem = {
    to: AppPath;
    label: string;
    icon: LucideIcon;
    end?: boolean;
};

export const mainNavItems: MainNavItem[] = [
    { to: paths.home, label: "Overview", icon: Home, end: true },
    { to: paths.dashboard, label: "Dashboard", icon: LayoutDashboard },
];

export const routesWithoutSidebar: AppPath[] = [paths.login, paths.register];

export const publicAuthPaths: AppPath[] = [paths.login, paths.register];

export function isRouteWithoutSidebar(pathname: string) {
    return routesWithoutSidebar.includes(pathname as AppPath);
}

export function isPublicAuthPath(pathname: string) {
    return publicAuthPaths.includes(pathname as AppPath);
}
