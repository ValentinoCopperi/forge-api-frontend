import type { UserResponseDto as User } from "@/shared/api/generated";
import { create } from "zustand";

type AuthState = {
    accessToken: string | null;
    user: User | null;

    setAuthentication: (token: string | null,  user: User | null) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,

    setAuthentication: (token, user) =>
        set({
            accessToken: token,
            user: user,
        }),

    logout: () =>
        set({
            accessToken: null,
            user: null,
        }),
}));