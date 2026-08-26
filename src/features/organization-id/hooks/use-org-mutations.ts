import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    getOrganizationsControllerFindOneQueryKey,
    useOrganizationsControllerUpdate,
} from "@/shared/api/generated";

export function useOrgMutations(orgId: number) {
    const queryClient = useQueryClient();
    const invalidateOrganization = () => {
        void queryClient.invalidateQueries({
            queryKey: getOrganizationsControllerFindOneQueryKey(orgId),
        });
    };

    const updateMutation = useOrganizationsControllerUpdate({
        mutation: {
            onSuccess: () => {
                toast.success("Organization updated");
                invalidateOrganization();
            },
            onError: () => {
                toast.error("Could not update organization", {
                    description: "Check your organization permissions and try again.",
                });
            },
        },
    });

    return { updateMutation };
}
