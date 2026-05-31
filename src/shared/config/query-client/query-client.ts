import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const NO_RETRY_STATUS_CODES: number[] = [400, 401, 403, 404, 422, 429];

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                const status = (error as AxiosError).response?.status;

                if (status !== undefined && NO_RETRY_STATUS_CODES.includes(status)) {
                    return false;
                }

                return failureCount < 3;
            },
        },
    },
});