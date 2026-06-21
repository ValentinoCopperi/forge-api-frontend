import {
    authControllerGetMe,
    authControllerLogin,
    useAuthControllerLogin as useAuthLogin,
    useAuthControllerGetMe as useAuthMe,
    useAuthControllerRegister as useAuthRegister,
    useAuthControllerLogout as useAuthLogout,
} from "@/shared/api/generated";
import { paths } from "@/shared/config/routes";
import { queryClient } from "@/shared/config/query-client/query-client";
import { useAuthStore } from "../stores/auth.store";


async function resetClientState() {
    await queryClient.cancelQueries();
    queryClient.clear();
    localStorage.clear();
}

export const useAuthLoginApi = (
    options?: Parameters<typeof useAuthLogin>[0],
) => {
    const setAuthentication = useAuthStore((s) => s.setAuthentication);

    return useAuthLogin({
        ...options,
        mutation: {
            onSuccess: async (data, variables, context, meta) => {
                await resetClientState();

                setAuthentication(data.accessToken ?? null, null);

                const user = await authControllerGetMe();

                useAuthStore.setState({ user });

                if (options?.mutation?.onSuccess) {
                    options.mutation.onSuccess(data, variables, context, meta);
                }
            },

            onError: (error, variables, context, meta) => {
                if (options?.mutation?.onError) {
                    options.mutation.onError(error, variables, context, meta);
                }
            },
        },
    });
};

export const useAuthRegisterApi = (
    options?: Parameters<typeof useAuthRegister>[0],
) => {
    const setAuthentication = useAuthStore((s) => s.setAuthentication);

    return useAuthRegister({
        ...options,
        mutation: {
            onSuccess: async (data, variables, context, meta) => {
                try {
                    await resetClientState();

                    const tokens = await authControllerLogin({
                        email: variables.data.email,
                        password: variables.data.password,
                    });

                    setAuthentication(tokens.accessToken ?? null, null);

                    const user = await authControllerGetMe();

                    useAuthStore.setState({ user });

                    options?.mutation?.onSuccess?.(data, variables, context, meta);
                } catch (error) {
                    if (options?.mutation?.onError) {
                        options.mutation.onError(error, variables, context, meta);
                    }
                }
            },

            onError: (error, variables, context, meta) => {
                if (options?.mutation?.onError) {
                    options.mutation.onError(error, variables, context, meta);
                }
            },
        },
    });
};

export const useAuthLogoutApi = (
    options?: Parameters<typeof useAuthLogout>[0],
) => {
    return useAuthLogout({
        ...options,
        mutation: {
            onSuccess: async (data, variables, context, meta) => {
                useAuthStore.getState().logout();
                localStorage.clear();
                await resetClientState();

                window.location.replace(paths.login);

                options?.mutation?.onSuccess?.(data, variables, context, meta);
            },

            onError: (error, variables, context, meta) => {
                options?.mutation?.onError?.(error, variables, context, meta);
            },
        },
    });
};

export const useGetUserApi = useAuthMe;