import { useCallback, useState } from "react";
import { getApiErrorMessage } from "@/shared/api/utils/api-error.utils";

type EndpointRunnerState = {
    data: unknown;
    error: string | null;
    isLoading: boolean;
    lastRunAt: Date | null;
};

const INITIAL_STATE: EndpointRunnerState = {
    data: null,
    error: null,
    isLoading: false,
    lastRunAt: null,
};

export function useEndpointRunner() {
    const [state, setState] = useState<EndpointRunnerState>(INITIAL_STATE);

    const reset = useCallback(() => {
        setState(INITIAL_STATE);
    }, []);

    const run = useCallback(async (action: () => Promise<unknown>) => {
        setState((prev) => ({
            ...prev,
            isLoading: true,
            error: null,
        }));

        try {
            const data = await action();

            setState({
                data,
                error: null,
                isLoading: false,
                lastRunAt: new Date(),
            });

            return data;
        } catch (error) {
            setState({
                data: null,
                error: getApiErrorMessage(error),
                isLoading: false,
                lastRunAt: new Date(),
            });

            throw error;
        }
    }, []);

    return {
        ...state,
        run,
        reset,
    };
}
