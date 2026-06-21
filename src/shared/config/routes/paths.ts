export const paths = {
    home: "/",
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
    profile: "/profile",
    settings: "/settings",
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];


export const pathBuilder = {
    org: (orgId: number | string) =>
        `${paths.dashboard}/organization/${orgId}`,
    orgRoles: (orgId: number | string) =>
        `${paths.dashboard}/organization/${orgId}/roles`,
    orgProjects: (orgId: number | string) =>
        `${paths.dashboard}/organization/${orgId}/projects`,
    orgProjectId: (orgId: number | string, projectId: number | string) =>
        `${paths.dashboard}/organization/${orgId}/projects/${projectId}`,
    orgProjectTasks: (orgId: number | string, projectId: number | string) =>
        `${paths.dashboard}/organization/${orgId}/projects/${projectId}/tasks`,
    orgProjectTaskId: (
        orgId: number | string,
        projectId: number | string,
        taskId: number | string
    ) =>
        `${paths.dashboard}/organization/${orgId}/projects/${projectId}/tasks/${taskId}`,
} as const;


/** Segments for nested routes under AppLayout */
export const pathSegments = {
    login: paths.login.slice(1),
    register: paths.register.slice(1),
    dashboard: paths.dashboard.slice(1),
    orgId: ":orgId",
    projects: "projects",
    projectId: ":projectId",
    tasks: "tasks",
    taskId: ":taskId",
    roles: "roles",

    org: `organization/:orgId`,
    orgRoles: `organization/:orgId/roles`,
    orgProjects: `organization/:orgId/projects`,
    orgProjectId: `organization/:orgId/projects/:projectId`,
    orgProjectTasks: `organization/:orgId/projects/:projectId/tasks`,
    orgProjectTaskId: `organization/:orgId/projects/:projectId/tasks/:taskId`,

    /** Segmentos atómicos para rutas anidadas */
    organization: "organization",
} as const;


