import { AppNavbar } from "@/shared/components/navbar/app-navbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-background">
            <AppNavbar />
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
}
