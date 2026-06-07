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

export const routesWithoutNavbar: AppPath[] = [paths.login];

export function isRouteWithoutNavbar(pathname: string) {
    return routesWithoutNavbar.includes(pathname as AppPath);
}
