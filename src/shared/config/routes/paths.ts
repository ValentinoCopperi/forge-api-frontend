export const paths = {
    home: "/",
    login: "/login",
    register: "/register",
    dashboard: "/dashboard",
} as const;

export type AppPath = (typeof paths)[keyof typeof paths];

/** Segments for nested routes under AppLayout */
export const pathSegments = {
    login: paths.login.slice(1),
    register: paths.register.slice(1),
    dashboard: paths.dashboard.slice(1),
} as const;
