import type { LucideIcon } from "lucide-react";

/** Opciones de color de acento disponibles en el sidebar */
export type AccentColor = "teal" | "steel-blue" | "purple";

/** Datos de un workspace (mock hasta integrar API) */
export type WorkspaceInfo = {
    id: string;
    name: string;
    role: string;
    initials: string;
};

/** Datos del usuario mostrados en el footer del sidebar */
export type SidebarUserInfo = {
    name: string;
    role: string;
    initials: string;
};

/** Item individual de navegación */
export type SidebarNavItemConfig = {
    to: string;
    label: string;
    icon: LucideIcon;
    badgeCount?: number;
    end?: boolean;
    disabled?: boolean;
    isActive?: (pathname: string) => boolean;
};

/** Grupo de navegación con etiqueta de sección */
export type SidebarNavGroupConfig = {
    label: string;
    items: SidebarNavItemConfig[];
};
