import { AppSidebar } from "@/shared/components/sidebar";
import { AppNavbar } from "@/shared/components/navbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-background">
            <AppSidebar />
            <div className="ml-64 min-h-screen">
                <AppNavbar />
                <main className="px-6 py-6 sm:px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
