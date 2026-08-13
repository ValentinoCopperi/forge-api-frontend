import type { UserResponseDtoRoles } from "@/shared/api/generated";

export type UserProfile = {
    id: number;
    name: string;
    email: string;
    avatarUrl: string | null;
    createdAt: string;
    roles: UserResponseDtoRoles[];
};
