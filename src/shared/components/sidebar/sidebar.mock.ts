import { Home, ShieldCheck } from "lucide-react";
import { paths } from "@/shared/config/routes";
import type {
    SidebarNavGroupConfig,
    SidebarUserInfo,
} from "./sidebar.types";

/**
 * Datos estáticos del sidebar.
 * Reemplazar por llamadas a la API cuando el backend esté disponible.
 */

export const MOCK_USER: SidebarUserInfo = {
    name: "Elena Rossi",
    role: "Director",
    initials: "ER",
};

export const SIDEBAR_NAV_GROUPS: SidebarNavGroupConfig[] = [
    {
        label: "Navigation",
        items: [
            {
                to: paths.dashboard,
                label: "Home",
                icon: Home,
                end: true,
                isActive: (pathname) =>
                    pathname === paths.home || pathname === paths.dashboard,
            },
            {
                to: "#",
                label: "Roles & Management",
                icon: ShieldCheck,
                disabled: true,
            },
        ],
    },
];
