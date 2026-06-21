import { useMatches, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { SidebarUserProfile } from "@/shared/components/sidebar/sidebar-user-profile";
import {
    paths,
    resolvePageHeader,
    type PageHeader,
    type PageHeaderHandle,
} from "@/shared/config/routes";
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
    Bell,
    CheckCircle2,
    Plus,
    Search,
    Settings,
    Sparkles,
    User,
} from "lucide-react";

type PageHeaderMatch = {
    params: Record<string, string | undefined>;
    handle?: PageHeaderHandle;
};

const fallbackHeader: PageHeader = {
    title: "Dashboard",
    subtitle: "Track your workspace activity and priorities.",
};

const notificationItems = [
    "2 project updates ready to review",
    "Workspace activity is up to date",
    "No blocked tasks detected",
];

const iconButtonClassName =
    "size-10 rounded-xl border-border bg-card shadow-sm hover:bg-muted/60";

export function AppNavbar() {
    const matches = useMatches() as PageHeaderMatch[];
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);


    const header =
        [...matches]
            .reverse()
            .map((match) => resolvePageHeader(match.handle, match.params))
            .find(Boolean) ?? fallbackHeader;

    return (
        <header className="sticky top-0 z-20 border-b border-border bg-background/90 px-6 py-4 shadow-sm backdrop-blur-xl sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground">
                            {header.title}
                        </h1>
                        <span className="inline-flex items-center gap-1 rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                            <Sparkles className="size-3.5" />
                            Live workspace
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{header.subtitle}</p>
                </div>

                <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                className="hidden h-10 w-56 justify-start rounded-xl border-border bg-card text-muted-foreground shadow-sm hover:bg-muted/60 lg:inline-flex"
                            >
                                <Search />
                                Search workspace
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                            <DropdownMenuLabel>Search shortcuts</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => navigate(paths.dashboard)}>
                                <Search />
                                Find dashboard insights
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => navigate(paths.profile)}>
                                <User />
                                Search my profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => navigate(paths.settings)}>
                                <Settings />
                                Search settings
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button type="button" className="h-10 rounded-xl px-3 shadow-sm">
                                <Plus />
                                Quick actions
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Workspace</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => navigate(paths.dashboard)}>
                                <Search />
                                Open dashboard
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => navigate(paths.settings)}>
                                <Settings />
                                Team settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => navigate(paths.profile)}>
                                <User />
                                My profile
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon-lg"
                                className={iconButtonClassName}
                                aria-label="Open notifications"
                            >
                                <Bell />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-72">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {notificationItems.map((item) => (
                                <DropdownMenuItem key={item} onSelect={() => navigate(paths.dashboard)}>
                                    <CheckCircle2 className="text-primary" />
                                    <span>{item}</span>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon-lg"
                        className={iconButtonClassName}
                        aria-label="Open settings"
                        onClick={() => navigate(paths.settings)}
                    >
                        <Settings />
                    </Button>

                    {user ? <SidebarUserProfile user={user} variant="navbar" /> : null}
                </div>
            </div>
        </header>
    );
}
