import { useState, type ComponentType } from "react";
import {
    TUTORIAL_SECTIONS,
    TutorialAuthSection,
    TutorialAvatarSection,
    TutorialOrganizationsSection,
    TutorialPageHeader,
    TutorialRoadmapSection,
    TutorialSectionNav,
    type TutorialSectionId,
} from "@/features/tutorial";

const SECTION_CONTENT: Record<TutorialSectionId, ComponentType> = {
    auth: TutorialAuthSection,
    organizations: TutorialOrganizationsSection,
    avatar: TutorialAvatarSection,
    roadmap: TutorialRoadmapSection,
};

export default function TutorialPage() {
    const [activeSection, setActiveSection] =
        useState<TutorialSectionId>("auth");

    const ActiveSection = SECTION_CONTENT[activeSection];

    return (
        <div className="mx-auto flex w-full max-w-[85vw] flex-col gap-6">
            <TutorialPageHeader />

            <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
                <aside className="lg:sticky lg:top-6 lg:self-start">
                    <TutorialSectionNav
                        sections={TUTORIAL_SECTIONS}
                        activeSection={activeSection}
                        onSectionChange={setActiveSection}
                    />
                </aside>

                <div>
                    <ActiveSection />
                </div>
            </div>
        </div>
    );
}
