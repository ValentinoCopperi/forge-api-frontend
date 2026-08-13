import { useQuery } from "@tanstack/react-query";
import { customInstance } from "@/shared/api/axios/axios.mutator";
import type { UserProfile } from "../types/users.types";

type ObjectResponse<T> = T & { timestamp: string };

export function getUserProfile(id: number, signal?: AbortSignal) {
    return customInstance<ObjectResponse<UserProfile>>({
        url: `/users/${id}`,
        method: "GET",
        signal,
    });
}

export const userProfileQueryKey = (id: number | undefined) =>
    ["users", "profile", id] as const;

export function useUserProfile(id: number | undefined) {
    return useQuery({
        queryKey: userProfileQueryKey(id),
        queryFn: ({ signal }) => getUserProfile(id as number, signal),
        enabled: id != null && !Number.isNaN(id),
    });
}
