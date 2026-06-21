import {
    Building2,
    CheckSquare,
    Layers,
    ShieldCheck,
} from "lucide-react";
import { pathBuilder } from "@/shared/config/routes";
import type { SidebarNavGroupConfig } from "./sidebar.types";

export function resolveSelectedOrganizationId(
    orgIdParam?: string
): number | null {
    if (orgIdParam) {
        const parsedId = Number(orgIdParam);
        return Number.isNaN(parsedId) ? null : parsedId;
    }

    return null;
}

export function getOrganizationNavGroup(
    orgId: number | string,
    projectId?: string | number | null
): SidebarNavGroupConfig {
    const organizationPath = pathBuilder.org(orgId);
    const rolesPath = pathBuilder.orgRoles(orgId);
    const projectsPath = pathBuilder.orgProjects(orgId);
    const resolvedProjectId =
        projectId !== null && projectId !== undefined && projectId !== ""
            ? projectId
            : null;
    const tasksPath = resolvedProjectId
        ? pathBuilder.orgProjectTasks(orgId, resolvedProjectId)
        : null;

    return {
        label: "Organization",
        items: [
            {
                to: organizationPath,
                label: "Organization",
                icon: Building2,
                end: true,
                isActive: (pathname) => pathname === organizationPath,
            },
            {
                to: projectsPath,
                label: "Projects",
                icon: Layers,
                end: true,
                isActive: (pathname) => {
                    if (pathname === projectsPath) {
                        return true;
                    }

                    const projectPrefix = `${projectsPath}/`;

                    return (
                        pathname.startsWith(projectPrefix) &&
                        !pathname.slice(projectPrefix.length).includes("/tasks")
                    );
                },
            },
            {
                to: tasksPath ?? "#",
                label: "Tasks",
                icon: CheckSquare,
                end: true,
                disabled: !tasksPath,
                isActive: (pathname) =>
                    tasksPath ? pathname.startsWith(`${tasksPath}`) : false,
            },
            {
                to: rolesPath,
                label: "Roles & Management",
                icon: ShieldCheck,
                end: true,
                isActive: (pathname) => pathname === rolesPath,
            },
        ],
    };
}
