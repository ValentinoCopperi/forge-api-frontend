
import type { UserWithRole as User } from "@/shared/api/generated";
import { create } from "zustand";

type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;

    setAuthentication: (token: string | null, refreshToken: string | null,  user: User | null) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    refreshToken: null,
    user: null,

    setAuthentication: (token, refreshToken, user) =>
        set({
            accessToken: token,
            refreshToken: refreshToken,
            user: user,
        }),

    logout: () =>
        set({
            accessToken: null,
            refreshToken: null,
            user: null,
        }),
}));