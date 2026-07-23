import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getOrganizationsControllerFindOneQueryKey,
    useOrganizationsControllerAddUserToOrganization,
    useOrganizationsControllerRemoveUserFromOrganization,
    useOrganizationsControllerUpdateUserOrganizationRole,
} from "../api";

export function useOrgMemberMutations(orgId: number) {
    const queryClient = useQueryClient();

    const invalidateOrg = () => {
        void queryClient.invalidateQueries({
            queryKey: getOrganizationsControllerFindOneQueryKey(orgId),
        });
    };

    const addMutation = useOrganizationsControllerAddUserToOrganization({
        mutation: {
            onSuccess: () => {
                toast.success("Member added successfully");
                invalidateOrg();
            },
            onError: () =>
                toast.error("Could not add member", {
                    description:
                        "Verify permissions or that the email is registered.",
                }),
        },
    });

    const updateRoleMutation =
        useOrganizationsControllerUpdateUserOrganizationRole({
            mutation: {
                onSuccess: () => {
                    toast.success("Role updated");
                    invalidateOrg();
                },
                onError: () =>
                    toast.error("Could not update role", {
                        description: "Check your permissions and try again.",
                    }),
            },
        });

    const removeMutation =
        useOrganizationsControllerRemoveUserFromOrganization({
            mutation: {
                onSuccess: () => {
                    toast.success("Member removed");
                    invalidateOrg();
                },
                onError: () =>
                    toast.error("Could not remove member", {
                        description: "Check your permissions and try again.",
                    }),
            },
        });

    return { addMutation, updateRoleMutation, removeMutation };
}
