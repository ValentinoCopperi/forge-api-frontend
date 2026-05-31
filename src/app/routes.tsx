import {
    createBrowserRouter,
} from "react-router-dom";
import { lazy } from "react";
import withSuspense from "@/shared/utils/with-suspense";
import AppLayout from "./layout";


//Import con lazy loading
const HomePage = lazy(() => import('@/pages/home/home.page'))
const LoginPage = lazy(() => import('@/pages/login/login.page'))
const DashboardPage = lazy(() => import('@/pages/dashboard/dashboard.page'))


export const routes = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: withSuspense(HomePage),
            },
            {
                path: "login",
                element: withSuspense(LoginPage),
            },
            {
                path: "dashboard",
                element:withSuspense(DashboardPage),
            },
        ]
    }
])

