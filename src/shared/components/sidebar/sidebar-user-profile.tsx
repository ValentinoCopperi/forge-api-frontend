import { useAuthLogoutApi } from "@/features/auth/api/auth.api";
import type { UserResponseDto as User } from "@/shared/api/generated";
import { pathBuilder, paths } from "@/shared/config/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { formatUserRole } from "@/shared/utils/role.utils";
import { cn } from "@/shared/utils/utils";
import {
    ChevronDown,
    ChevronRight,
    LogOut,
    Settings,
    User as UserIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type SidebarUserProfileProps = {
    user: User;
    variant?: "sidebar" | "navbar";
};

/**
 * Tarjeta de perfil del usuario con menú de acciones desplegable.
 */
export function SidebarUserProfile({
    user,
    variant = "sidebar",
}: SidebarUserProfileProps) {
    const navigate = useNavigate();
    const initials = getInitials(user.name, user.email);
    const avatarSrc = getAvatarSrc(user.avatarUrl);
    const isNavbar = variant === "navbar";

    const logoutMutation = useAuthLogoutApi();

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={cn(
                        "group flex items-center border border-border bg-card text-left transition-colors hover:bg-muted/50 data-[state=open]:bg-muted/50",
                        isNavbar
                            ? "h-9 w-auto shrink-0 gap-2 rounded-md px-1.5 shadow-none sm:w-[190px] sm:px-2"
                            : "w-full gap-3 rounded-lg px-3 py-2.5"
                    )}
                    aria-label={`User profile: ${user.name}`}
                >
                    <Avatar className={cn("shrink-0", isNavbar ? "size-7" : "size-9")}>
                        {avatarSrc ? (
                            <AvatarImage src={avatarSrc} alt={user.name} />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <span className={cn("min-w-0 flex-1", isNavbar && "hidden sm:block")}>
                        <span className="block truncate text-sm font-semibold text-foreground">
                            {user.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                            {formatUserRole(user.roles)}
                        </span>
                    </span>

                    {isNavbar ? (
                        <span className="hidden size-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors group-hover:bg-muted sm:flex">
                            <ChevronDown className="size-3.5" />
                        </span>
                    ) : (
                        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                side={isNavbar ? "bottom" : "top"}
                align={isNavbar ? "end" : "start"}
                className="w-52"
            >
                <DropdownMenuItem
                    onSelect={() => navigate(pathBuilder.userProfile(user.id))}
                >
                    <UserIcon />
                    Profile
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => navigate(paths.settings)}>
                    <Settings />
                    Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    variant="destructive"
                    disabled={logoutMutation.isPending}
                    onSelect={handleLogout}
                >
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
