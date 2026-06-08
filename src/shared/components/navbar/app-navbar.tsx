import { useAuthStore } from "@/features/auth";
import {
    isRouteWithoutNavbar,
    mainNavItems,
    paths,
    type MainNavItem,
} from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { cn } from "@/shared/utils/utils";
import type { UserResponseDto } from "@/shared/api/generated";
import {
    Bell,
    LogOut,
    Menu,
    Search,
    Settings,
    X,
    Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

function getInitials(name?: string, email?: string) {
    if (name?.trim()) {
        return name
            .split(" ")
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join("");
    }

    return email?.slice(0, 2).toUpperCase() ?? "U";
}

function getAvatarSrc(avatarUrl?: UserResponseDto["avatarUrl"]) {
    const value = avatarUrl as unknown;

    if (typeof value === "string" && value.trim()) {
        return value;
    }

    return undefined;
}

function UserAvatar({
    name,
    email,
    avatarUrl,
    size = "default",
    className,
}: {
    name?: string;
    email?: string;
    avatarUrl?: UserResponseDto["avatarUrl"];
    size?: "default" | "sm" | "lg";
    className?: string;
}) {
    const initials = getInitials(name, email);
    const src = getAvatarSrc(avatarUrl);

    return (
        <Avatar size={size} className={className}>
            {src ? <AvatarImage src={src} alt={name ?? email ?? "User"} /> : null}
            <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                {initials}
            </AvatarFallback>
        </Avatar>
    );
}

function NavItem({
    to,
    label,
    icon: Icon,
    end,
    onNavigate,
}: MainNavItem & { onNavigate?: () => void }) {
    return (
        <NavLink
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
                cn(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
            }
        >
            <Icon className="size-4" />
            {label}
        </NavLink>
    );
}

export function AppNavbar() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const isAuthenticated = useAuthStore((state) => Boolean(state.accessToken));

    if (isRouteWithoutNavbar(location.pathname)) {
        return null;
    }

    const closeMobileMenu = () => setMobileOpen(false);

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
            <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
                <Link
                    to={paths.home}
                    className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-90"
                >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                        <Zap className="size-4" />
                    </span>
                    <div className="hidden sm:block">
                        <span className="block text-sm font-semibold tracking-tight">
                            Forge
                        </span>
                        <span className="block text-[11px] leading-none text-muted-foreground">
                            Enterprise
                        </span>
                    </div>
                </Link>

                <nav className="hidden items-center gap-1 md:flex">
                    {mainNavItems.map((item) => (
                        <NavItem key={item.to} {...item} />
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-1 sm:gap-2">
                    <div className="relative hidden lg:block">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search..."
                            className="h-9 w-56 rounded-lg border border-input bg-muted/40 pr-3 pl-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:bg-background focus:ring-3 focus:ring-ring/30"
                        />
                    </div>

                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="hidden sm:inline-flex"
                        aria-label="Notifications"
                    >
                        <Bell className="size-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="hidden sm:inline-flex"
                        aria-label="Settings"
                    >
                        <Settings className="size-4" />
                    </Button>

                    {isAuthenticated ? (
                        <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-2 py-1 sm:flex">
                            <UserAvatar
                                name={user?.name}
                                email={user?.email}
                                avatarUrl={user?.avatarUrl}
                            />
                            <div className="hidden min-w-0 pr-1 lg:block">
                                <p className="truncate text-sm font-medium">
                                    {user?.name ?? "User"}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {user?.email ?? "Signed in"}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                aria-label="Sign out"
                                onClick={logout}
                            >
                                <LogOut className="size-4" />
                            </Button>
                        </div>
                    ) : (
                        <Button asChild size="sm" className="hidden sm:inline-flex">
                            <Link to={paths.login}>Sign in</Link>
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="md:hidden"
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileOpen}
                        onClick={() => setMobileOpen((open) => !open)}
                    >
                        {mobileOpen ? (
                            <X className="size-4" />
                        ) : (
                            <Menu className="size-4" />
                        )}
                    </Button>
                </div>
            </div>

            {mobileOpen ? (
                <div className="border-t border-border bg-background md:hidden">
                    <div className="mx-auto max-w-7xl space-y-3 px-4 py-4 sm:px-6">
                        <div className="relative">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="search"
                                placeholder="Search..."
                                className="h-9 w-full rounded-lg border border-input bg-muted/40 pr-3 pl-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:bg-background focus:ring-3 focus:ring-ring/30"
                            />
                        </div>

                        <nav className="flex flex-col gap-1">
                            {mainNavItems.map((item) => (
                                <NavItem
                                    key={item.to}
                                    {...item}
                                    onNavigate={closeMobileMenu}
                                />
                            ))}
                        </nav>

                        {isAuthenticated ? (
                            <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <UserAvatar
                                        name={user?.name}
                                        email={user?.email}
                                        avatarUrl={user?.avatarUrl}
                                        className="size-9"
                                    />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">
                                            {user?.name ?? "User"}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {user?.email}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        logout();
                                        closeMobileMenu();
                                    }}
                                >
                                    <LogOut className="size-4" />
                                    Sign out
                                </Button>
                            </div>
                        ) : (
                            <Button asChild className="w-full">
                                <Link to={paths.login} onClick={closeMobileMenu}>
                                    Sign in
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            ) : null}
        </header>
    );
}
