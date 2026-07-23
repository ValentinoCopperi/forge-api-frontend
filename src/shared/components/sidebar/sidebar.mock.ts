import { Book, Building2, Home, Settings, ShieldCheck } from "lucide-react";
import { paths, pathSegments } from "@/shared/config/routes";
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
                to: pathSegments.tutorial,
                label: "Tutorial",
                icon: Book,
            },
            {
                to: pathSegments.organizations,
                label: "Organizations",
                icon: Building2,
            },
            {
                to: pathSegments.roles_management,
                label: "Roles & Management",
                icon: ShieldCheck,
            },
            {
                to: pathSegments.settings,
                label: "Settings",
                icon: Settings,
            },
        ],
    },
];
