import type { OrganizationMemberResponseDto } from "@/shared/api/generated";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { cn } from "@/shared/utils/utils";

type ProjectManagerSelectProps = {
    members: OrganizationMemberResponseDto[];
    value: number | null;
    onChange: (userId: number) => void;
    disabled?: boolean;
};

export function ProjectManagerSelect({
    members,
    value,
    onChange,
    disabled,
}: ProjectManagerSelectProps) {
    if (members.length === 0) {
        return (
            <p className="text-xs text-muted-foreground">
                No organization members available.
            </p>
        );
    }

    return (
        <div className="max-h-56 space-y-1 overflow-y-auto rounded-xl border border-border/70 bg-muted/10 p-1.5">
            {members.map((member) => {
                const isSelected = value === member.User.id;
                const avatarSrc = getAvatarSrc(member.User.avatarUrl);

                return (
                    <button
                        key={member.User.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => onChange(member.User.id)}
                        className={cn(
                            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                            isSelected
                                ? "bg-primary/10 text-primary ring-1 ring-primary/25"
                                : "hover:bg-muted/60"
                        )}
                    >
                        <Avatar className="size-7 shrink-0 border border-border">
                            {avatarSrc ? (
                                <AvatarImage src={avatarSrc} alt={member.User.name} />
                            ) : null}
                            <AvatarFallback className="bg-muted text-[10px] font-semibold text-muted-foreground">
                                {getInitials(member.User.name)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="min-w-0 flex-1 truncate">
                            {member.User.name}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
