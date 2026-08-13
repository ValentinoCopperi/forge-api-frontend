import { resolvePageHeader, type PageHeaderHandle } from "./page-header";
import { paths } from "./paths";

export type BreadcrumbItem = {
    label: string;
    href?: string;
};

export type BreadcrumbMatch = {
    pathname: string;
    params: Record<string, string | undefined>;
    handle?: PageHeaderHandle;
};

const STATIC_SEGMENT_LABELS: Record<string, string> = {
    organizations: "Organizations",
    roles_management: "Roles & Management",
    settings: "Settings",
    tutorial: "Tutorial",
    organization: "Organization",
    roles: "Roles",
    projects: "Projects",
    tasks: "Tasks",
    profile: "Profile",
};

function formatDynamicLabel(
    title: string,
    params: Readonly<Record<string, string | undefined>>
) {
    const { orgId, projectId, taskId, userId } = params;

    if (title === "Task" && taskId) return `Task #${taskId}`;
    if (title === "Project" && projectId) return `Project #${projectId}`;
    if (title === "Organization" && orgId) return `Organization #${orgId}`;
    if (title === "Profile" && userId) return `Profile #${userId}`;

    return title;
}

function resolveMatchLabel(match: BreadcrumbMatch) {
    const header = resolvePageHeader(match.handle, match.params);

    if (header?.title) {
        return formatDynamicLabel(header.title, match.params);
    }

    const segment = match.pathname.split("/").filter(Boolean).at(-1);

    if (!segment || segment.startsWith(":")) {
        return undefined;
    }

    return STATIC_SEGMENT_LABELS[segment];
}

export function resolveBreadcrumbs(
    matches: BreadcrumbMatch[],
    pathname: string
): BreadcrumbItem[] {
    const seen = new Set<string>();
    const items: BreadcrumbItem[] = [];

    for (const match of matches) {
        const label = resolveMatchLabel(match);

        if (!label || seen.has(match.pathname)) {
            continue;
        }

        seen.add(match.pathname);
        items.push({ label, href: match.pathname });
    }

    if (items.length === 0) {
        return [{ label: "Dashboard" }];
    }

    if (pathname !== paths.dashboard && items[0]?.href !== paths.dashboard) {
        items.unshift({ label: "Home", href: paths.dashboard });
    }

    const lastItem = items.at(-1);

    if (lastItem) {
        delete lastItem.href;
    }

    return items;
}
