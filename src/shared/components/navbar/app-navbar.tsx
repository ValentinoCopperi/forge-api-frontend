import { useLocation, useMatches, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useHealthCheckApi } from "@/shared/api/api.health";
import { SidebarUserProfile } from "@/shared/components/sidebar/sidebar-user-profile";
import {
    pathBuilder,
    paths,
    resolveBreadcrumbs,
    resolvePageHeader,
    type PageHeader,
    type PageHeaderHandle,
} from "@/shared/config/routes";
import { AppBreadcrumbs } from "@/shared/components/navbar/app-breadcrumbs";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
    Menu,
    Moon,
    Search,
    Settings,
    Sun,
    User,
} from "lucide-react";

type PageHeaderMatch = {
    pathname: string;
    params: Record<string, string | undefined>;
    handle?: PageHeaderHandle;
};

type AppNavbarProps = {
    onMenuClick?: () => void;
};

const fallbackHeader: PageHeader = {
    title: "Dashboard",
    subtitle: "Track your workspace activity and priorities.",
};

const iconButtonClassName =
    "relative size-9 rounded-md border-border bg-card shadow-none hover:border-border-strong hover:bg-muted";

export function AppNavbar({ onMenuClick }: AppNavbarProps) {
    const location = useLocation();
    const matches = useMatches() as PageHeaderMatch[];
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const { resolvedTheme, setTheme } = useTheme();
    const health = useHealthCheckApi({
        query: { retry: false, refetchInterval: 30_000 },
    });
    const breadcrumbs = resolveBreadcrumbs(matches, location.pathname);
    const header =
        [...matches]
            .reverse()
            .map((match) => resolvePageHeader(match.handle, match.params))
            .find(Boolean) ?? fallbackHeader;

    const isDark = resolvedTheme === "dark";

    return (
        <header className="sticky top-0 z-30 border-b border-border bg-card/95 supports-backdrop-filter:backdrop-blur-lg">
            <div className="flex h-16 items-center gap-3 px-4 sm:px-6 xl:px-8">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-lg"
                    className="rounded-md lg:hidden"
                    onClick={onMenuClick}
                    aria-label="Open navigation"
                >
                    <Menu />
                </Button>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5">
                        <h1 className="truncate text-sm font-bold tracking-[-0.015em] text-foreground">
                            {header.title}
                        </h1>
                        <span className={health.isSuccess
                            ? "hidden items-center gap-1.5 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-bold text-success sm:inline-flex"
                            : "hidden items-center gap-1.5 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground sm:inline-flex"
                        }>
                            <span className={health.isSuccess ? "size-1.5 rounded-full bg-success" : "size-1.5 rounded-full bg-faint"} aria-hidden />
                            {health.isLoading ? "API CHECK" : health.isSuccess ? "API LIVE" : "API OFFLINE"}
                        </span>
                    </div>
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground sm:hidden">
                        {header.subtitle}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="hidden h-9 w-52 justify-start rounded-md border-border bg-background text-xs text-muted-foreground shadow-none hover:bg-muted xl:inline-flex"
                            >
                                <Search />
                                Jump to workspace
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64 rounded-lg">
                            <DropdownMenuLabel>Workspace shortcuts</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => navigate(paths.dashboard)}>
                                <Search /> Find dashboard insights
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={!user} onSelect={() => user && navigate(pathBuilder.userProfile(user.id))}>
                                <User /> Search my profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => navigate(paths.settings)}>
                                <Settings /> Search settings
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon-lg"
                        className={iconButtonClassName}
                        aria-label={isDark ? "Use light theme" : "Use dark theme"}
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                    >
                        {isDark ? <Sun /> : <Moon />}
                    </Button>

                    {user ? <SidebarUserProfile user={user} variant="navbar" /> : null}
                </div>
            </div>

            <div className="flex h-9 items-center border-t border-border bg-background px-4 sm:px-6 xl:px-8">
                <AppBreadcrumbs items={breadcrumbs} />
                <p className="ml-auto hidden max-w-[48ch] truncate text-[11px] text-muted-foreground md:block">
                    {header.subtitle}
                </p>
            </div>
        </header>
    );
}
