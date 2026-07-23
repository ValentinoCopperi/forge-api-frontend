import { ExternalLink, MoreHorizontal, Trash2, UserCog } from "lucide-react";
import { Link } from "react-router-dom";
import type {
    OrganizationMemberResponseDto,
    OrganizationsGetAllByUserResponseDtoRole,
} from "@/shared/api/generated";
import { OrganizationRoleBadge } from "@/features/organizations";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { pathBuilder } from "@/shared/config/routes";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";

type MemberRowProps = {
    member: OrganizationMemberResponseDto;
    onUpdateRole: (member: OrganizationMemberResponseDto) => void;
    onRemove: (member: OrganizationMemberResponseDto) => void;
};

export function MemberRow({ member, onUpdateRole, onRemove }: MemberRowProps) {
    const user = member.User;
    const avatarSrc = getAvatarSrc(user.avatarUrl);

    return (
        <tr className="group border-b border-border/60 transition-colors last:border-b-0 odd:bg-muted/20 even:bg-card hover:bg-primary/5">
            {/* Member */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <Avatar className="size-10 shrink-0 border border-border shadow-sm">
                        {avatarSrc ? (
                            <AvatarImage src={avatarSrc} alt={user.name} />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                            {getInitials(user.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <Link
                            to={pathBuilder.userProfile(user.id)}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                        >
                            {user.name}
                            <ExternalLink className="size-3 opacity-0 transition-opacity group-hover:opacity-60" />
                        </Link>
                        <p className="mt-0.5 max-w-xs truncate text-xs text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </div>
            </td>

            {/* Role */}
            <td className="px-5 py-4">
                <OrganizationRoleBadge
                    role={member.role as OrganizationsGetAllByUserResponseDtoRole}
                />
            </td>

            {/* User ID */}
            <td className="px-5 py-4">
                <span className="font-mono text-xs text-muted-foreground">
                    #{user.id}
                </span>
            </td>

            {/* Membership ID */}
            <td className="px-5 py-4">
                <span className="font-mono text-xs text-muted-foreground">
                    #{member.id}
                </span>
            </td>

            {/* Actions */}
            <td className="px-5 py-4">
                <div className="flex items-center justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon-sm"
                                aria-label={`Actions for ${user.name}`}
                            >
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuItem asChild>
                                <Link to={pathBuilder.userProfile(user.id)}>
                                    <ExternalLink className="size-4" />
                                    View profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onUpdateRole(member)}>
                                <UserCog className="size-4" />
                                Update role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => onRemove(member)}
                            >
                                <Trash2 className="size-4" />
                                Remove from organization
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </td>
        </tr>
    );
}

type MembersTableProps = {
    members: OrganizationMemberResponseDto[];
    onUpdateRole: (member: OrganizationMemberResponseDto) => void;
    onRemove: (member: OrganizationMemberResponseDto) => void;
};

export function MembersTable({ members, onUpdateRole, onRemove }: MembersTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                    <tr className="border-b border-primary/10 dashboard-table-head">
                        <th className="px-5 py-3.5 text-[11px] font-bold tracking-wider uppercase">
                            Member
                        </th>
                        <th className="px-5 py-3.5 text-[11px] font-bold tracking-wider uppercase">
                            Role
                        </th>
                        <th className="px-5 py-3.5 text-[11px] font-bold tracking-wider uppercase">
                            User ID
                        </th>
                        <th className="px-5 py-3.5 text-[11px] font-bold tracking-wider uppercase">
                            Membership ID
                        </th>
                        <th className="px-5 py-3.5 text-right text-[11px] font-bold tracking-wider uppercase">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <MemberRow
                            key={member.id}
                            member={member}
                            onUpdateRole={onUpdateRole}
                            onRemove={onRemove}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
