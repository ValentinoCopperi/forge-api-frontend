import { AppSidebar } from "@/shared/components/sidebar";
import { AppNavbar } from "@/shared/components/navbar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/shared/utils/utils";

export default function AppLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div className="app-canvas min-h-screen">
            <AppSidebar
                collapsed={sidebarCollapsed}
                mobileOpen={mobileSidebarOpen}
                onCollapsedChange={() => setSidebarCollapsed((value) => !value)}
                onMobileClose={() => setMobileSidebarOpen(false)}
            />
            <div
                className={cn(
                    "min-h-screen transition-[margin] duration-300 ease-out",
                    "lg:ml-(--sidebar-width)",
                    sidebarCollapsed && "lg:ml-(--sidebar-width-collapsed)"
                )}
            >
                <AppNavbar onMenuClick={() => setMobileSidebarOpen(true)} />
                <main className="page-enter px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-7">
                    <div className="mx-auto w-full max-w-[1680px]">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
