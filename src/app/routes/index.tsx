import { AppRouteError } from "@/shared/components/errors/app-error";
import {
    pathBuilder,
    pathSegments,
    paths,
    type PageHeaderHandle,
} from "@/shared/config/routes";
import withSuspense from "@/shared/utils/with-suspense";
import { lazy } from "react";
import { createBrowserRouter, redirect } from "react-router-dom";
import AppLayout from "../layout";
import { RoutesGuard } from "@/features/auth/guards/private.guard";
import { PublicOnlyGuard } from "@/features/auth/guards/public-only.guard";

const LoginPage = lazy(() => import("@/pages/login/login.page"));
const RegisterPage = lazy(() => import("@/pages/register/register.page"));
const DashboardPage = lazy(() => import("@/pages/dashboard/dashboard.page"));
const OrgPage = lazy(() => import("@/pages/organization/org.page"));
const OrgRolesPage = lazy(() => import("@/pages/organization/org-roles.page"));
const ProjectsPage = lazy(() => import("@/pages/projects/projects.page"));
const ProjectPage = lazy(() => import("@/pages/projects/project.page"));
const TasksPage = lazy(() => import("@/pages/tasks/tasks.page"));
const TaskPage = lazy(() => import("@/pages/tasks/task.page"));
const NotFoundPage = lazy(() => import("@/pages/not-found/not-found.page"));

const pageHeaders = {
    dashboard: {
        title: "Dashboard",
        subtitle: "Track organizations, projects, and task health at a glance.",
    },
    organization: ({ orgId }) => ({
        title: "Organization",
        subtitle: `Manage organization ${orgId ?? "details"} and its workspace context.`,
    }),
    roles: ({ orgId }) => ({
        title: "Organization roles",
        subtitle: `Review access and responsibilities for organization ${orgId ?? "members"}.`,
    }),
    projects: ({ orgId }) => ({
        title: "Projects",
        subtitle: `Browse and manage projects for organization ${orgId ?? "workspace"}.`,
    }),
    project: ({ projectId }) => ({
        title: "Project",
        subtitle: `Review project ${projectId ?? "details"} and its delivery status.`,
    }),
    tasks: ({ projectId }) => ({
        title: "Tasks",
        subtitle: `Track the task backlog for project ${projectId ?? "workspace"}.`,
    }),
    task: ({ taskId }) => ({
        title: "Task",
        subtitle: `Review task ${taskId ?? "details"} and its current progress.`,
    }),
    notFound: {
        title: "Page not found",
        subtitle: "The page you are looking for does not exist.",
    },
} satisfies Record<string, PageHeaderHandle["pageHeader"]>;

export const routes = createBrowserRouter([
    {
        path: paths.login,
        element: <PublicOnlyGuard> {withSuspense(LoginPage)} </PublicOnlyGuard>,
        errorElement: <AppRouteError />,
    },
    {
        path: paths.register,
        element: <PublicOnlyGuard> {withSuspense(RegisterPage)} </PublicOnlyGuard>,
        errorElement: <AppRouteError />,
    },
    {
        path: paths.home,
        loader: () => {
            const orgId = localStorage.getItem("forge.last-org");

            return orgId
                ? redirect(pathBuilder.org(orgId))
                : redirect(paths.dashboard);
        },
    },
    {
        path: paths.dashboard,
        element: (
            <RoutesGuard>
                <AppLayout />
            </RoutesGuard>
        ),
        errorElement: <AppRouteError />,
        children: [
            {
                index: true,
                element: withSuspense(DashboardPage),
                handle: { pageHeader: pageHeaders.dashboard },
            },
            {
                path: pathSegments.organization,
                children: [
                    {
                        index: true,
                        element: withSuspense(NotFoundPage),
                        handle: { pageHeader: pageHeaders.notFound },
                    },
                    {
                        path: pathSegments.orgId,
                        children: [
                            {
                                index: true,
                                element: withSuspense(OrgPage),
                                handle: { pageHeader: pageHeaders.organization },
                            },
                            {
                                path: pathSegments.roles,
                                element: withSuspense(OrgRolesPage),
                                handle: { pageHeader: pageHeaders.roles },
                            },
                            {
                                path: pathSegments.projects,
                                children: [
                                    {
                                        index: true,
                                        element: withSuspense(ProjectsPage),
                                        handle: { pageHeader: pageHeaders.projects },
                                    },
                                    {
                                        path: pathSegments.projectId,
                                        children: [
                                            {
                                                index: true,
                                                element: withSuspense(ProjectPage),
                                                handle: { pageHeader: pageHeaders.project },
                                            },
                                            {
                                                path: pathSegments.tasks,
                                                children: [
                                                    {
                                                        index: true,
                                                        element: withSuspense(TasksPage),
                                                        handle: { pageHeader: pageHeaders.tasks },
                                                    },
                                                    {
                                                        path: pathSegments.taskId,
                                                        element: withSuspense(TaskPage),
                                                        handle: { pageHeader: pageHeaders.task },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                path: "*",
                element: withSuspense(NotFoundPage),
                handle: { pageHeader: pageHeaders.notFound },
            },
        ],
    },
    {
        path: "*",
        element: withSuspense(NotFoundPage),
    },
]);
