import { useAuthLogoutApi } from "@/features/auth/api/auth.api";
import type { UserResponseDto as User } from "@/shared/api/generated";
import { paths } from "@/shared/config/routes";
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
                            ? "h-12 w-[250px] shrink-0 gap-3 rounded-2xl px-3 shadow-sm"
                            : "w-full gap-3 rounded-xl px-3 py-2.5"
                    )}
                    aria-label={`User profile: ${user.name}`}
                >
                    <Avatar className={cn("shrink-0", isNavbar ? "size-10" : "size-9")}>
                        {avatarSrc ? (
                            <AvatarImage src={avatarSrc} alt={user.name} />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-foreground">
                            {user.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                            {formatUserRole(user.roles)}
                        </span>
                    </span>

                    {isNavbar ? (
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors group-hover:bg-muted">
                            <ChevronDown className="size-4" />
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
                <DropdownMenuItem onSelect={() => navigate(paths.profile)}>
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
