import {
    Building2,
    ImageUp,
    KeyRound,
    ListTodo,
    type LucideIcon,
} from "lucide-react";

export type TutorialSectionId =
    | "auth"
    | "organizations"
    | "avatar"
    | "roadmap";

export type TutorialSection = {
    id: TutorialSectionId;
    label: string;
    description: string;
    icon: LucideIcon;
};

export const TUTORIAL_SECTIONS: TutorialSection[] = [
    {
        id: "auth",
        label: "Authentication",
        description: "Tokens, sessions, and the current user.",
        icon: KeyRound,
    },
    {
        id: "organizations",
        label: "Organizations",
        description: "Create, list, and manage workspaces.",
        icon: Building2,
    },
    {
        id: "avatar",
        label: "Avatar",
        description: "Upload and replace your profile image.",
        icon: ImageUp,
    },
    {
        id: "roadmap",
        label: "Coming soon",
        description: "Projects and tasks on the roadmap.",
        icon: ListTodo,
    },
];
