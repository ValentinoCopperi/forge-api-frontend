import type { TutorialSection, TutorialSectionId } from "../constants/tutorial-sections";
import { cn } from "@/shared/utils/utils";

type TutorialSectionNavProps = {
    sections: TutorialSection[];
    activeSection: TutorialSectionId;
    onSectionChange: (section: TutorialSectionId) => void;
};

export function TutorialSectionNav({
    sections,
    activeSection,
    onSectionChange,
}: TutorialSectionNavProps) {
    return (
        <nav className="space-y-2">
            {sections.map((section) => {
                const Icon = section.icon;
                const isActive = section.id === activeSection;

                return (
                    <button
                        key={section.id}
                        type="button"
                        onClick={() => onSectionChange(section.id)}
                        className={cn(
                            "flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-all",
                            isActive
                                ? "border-primary/30 bg-primary/10 shadow-sm"
                                : "border-transparent bg-card hover:border-border hover:bg-muted/40"
                        )}
                    >
                        <span
                            className={cn(
                                "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl border",
                                isActive
                                    ? "border-primary/20 bg-primary/15 text-primary"
                                    : "border-border bg-background text-muted-foreground"
                            )}
                        >
                            <Icon className="size-4" />
                        </span>
                        <span className="min-w-0">
                            <span className="block text-sm font-semibold text-foreground">
                                {section.label}
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                                {section.description}
                            </span>
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
