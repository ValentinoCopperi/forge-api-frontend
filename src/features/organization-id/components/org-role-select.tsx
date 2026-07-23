import type { AddUserToOrganizationDtoRole } from "@/shared/api/generated";
import { cn } from "@/shared/utils/utils";
import { ROLE_OPTIONS } from "../utils";

type OrgRoleSelectProps = {
    value: AddUserToOrganizationDtoRole;
    onChange: (value: AddUserToOrganizationDtoRole) => void;
    disabled?: boolean;
};

export function OrgRoleSelect({ value, onChange, disabled }: OrgRoleSelectProps) {
    return (
        <div className="grid grid-cols-2 gap-2">
            {ROLE_OPTIONS.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    disabled={disabled}
                    onClick={() => onChange(opt.value)}
                    className={cn(
                        "flex flex-col gap-0.5 rounded-xl border px-3 py-2.5 text-left text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50",
                        value === opt.value
                            ? "border-primary/50 bg-primary/8 text-primary ring-1 ring-primary/20"
                            : "border-border/70 bg-muted/20 text-foreground hover:border-primary/30 hover:bg-muted/40"
                    )}
                >
                    <span className="font-semibold leading-none">{opt.label}</span>
                    <span className="text-[11px] leading-tight text-muted-foreground">
                        {opt.description}
                    </span>
                </button>
            ))}
        </div>
    );
}
