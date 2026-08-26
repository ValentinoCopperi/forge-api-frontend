import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customInstance } from "@/shared/api/axios/axios.mutator";
import { getUsersControllerFindAllQueryKey } from "@/shared/api/generated";
import { API_PREFIX } from "@/shared/config/envs/env";
import type { UserProfile } from "../types/users.types";

type ObjectResponse<T> = T & { timestamp: string };

export const GLOBAL_ROLES = ["DIRECTOR", "GERENTE", "EMPLEADO"] as const;
export type GlobalRole = (typeof GLOBAL_ROLES)[number];

export function getUserProfile(id: number, signal?: AbortSignal) {
    return customInstance<ObjectResponse<UserProfile>>({
        url: `${API_PREFIX}/users/${id}`,
        method: "GET",
        signal,
    });
}

export function updateUserRoles(id: number, roles: GlobalRole[]) {
    return customInstance<void>({
        url: `${API_PREFIX}/users/${id}/roles`,
        method: "PATCH",
        data: { roles },
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

export function useUpdateUserRoles() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, roles }: { id: number; roles: GlobalRole[] }) =>
            updateUserRoles(id, roles),
        onSuccess: (_data, variables) => {
            toast.success("Global roles updated");
            void queryClient.invalidateQueries({
                queryKey: getUsersControllerFindAllQueryKey(),
            });
            void queryClient.invalidateQueries({
                queryKey: userProfileQueryKey(variables.id),
            });
        },
        onError: () => {
            toast.error("Could not update global roles", {
                description: "Only a director can assign roles. Please try again.",
            });
        },
    });
}
