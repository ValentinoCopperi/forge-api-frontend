import { AppRouteError } from "@/shared/components/errors/app-error";
import { pathSegments, paths } from "@/shared/config/routes";
import withSuspense from "@/shared/utils/with-suspense";
import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layout";
import { RoutesGuard } from "@/features/auth/guards/routes-guard";

const HomePage = lazy(() => import("@/pages/home/home.page"));
const LoginPage = lazy(() => import("@/pages/login/login.page"));
const RegisterPage = lazy(() => import("@/pages/register/register.page"));
const DashboardPage = lazy(() => import("@/pages/dashboard/dashboard.page"));

export const routes = createBrowserRouter([
    {
        path: paths.login,
        element: withSuspense(LoginPage),
        errorElement: <AppRouteError />,
    },
    {
        path: paths.register,
        element: withSuspense(RegisterPage),
        errorElement: <AppRouteError />,
    },
    {
        path: paths.home,
        element:<RoutesGuard> <AppLayout /> </RoutesGuard>, 
        errorElement: <AppRouteError />,
        children: [
            {
                index: true,
                element: withSuspense(HomePage),
            },
            {
                path: pathSegments.dashboard,
                element: withSuspense(DashboardPage),
            },
        ],
    },
]);
