import { cn } from "@/shared/utils/utils";
import type { AccentColor } from "./sidebar.types";

type AccentOption = {
    id: AccentColor;
    label: string;
    className: string;
};

const ACCENT_OPTIONS: AccentOption[] = [
    { id: "teal", label: "Teal", className: "bg-primary" },
    {
        id: "steel-blue",
        label: "Steel Blue",
        className: "bg-[oklch(0.55_0.1_240)]",
    },
    {
        id: "purple",
        label: "Purple",
        className: "bg-[oklch(0.55_0.15_300)]",
    },
];

type SidebarAccentPickerProps = {
    value: AccentColor;
    onChange: (color: AccentColor) => void;
};

/**
 * Selector de color de acento (solo UI, sin persistencia por ahora).
 */
export function SidebarAccentPicker({
    value,
    onChange,
}: SidebarAccentPickerProps) {
    return (
        <div className="space-y-2">
            <p className="px-1 text-[11px] font-medium tracking-wider text-muted-foreground uppercase">
                Accent
            </p>

            <div className="flex items-center gap-2 px-1">
                {ACCENT_OPTIONS.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        aria-label={`Accent color: ${option.label}`}
                        aria-pressed={value === option.id}
                        onClick={() => onChange(option.id)}
                        className={cn(
                            "size-5 rounded-full transition-shadow",
                            option.className,
                            value === option.id
                                ? "ring-2 ring-foreground ring-offset-2 ring-offset-sidebar"
                                : "hover:ring-2 hover:ring-border hover:ring-offset-2 hover:ring-offset-sidebar"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
