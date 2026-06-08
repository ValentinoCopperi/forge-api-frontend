import {
    authControllerGetMe,
    authControllerLogin,
    useAuthControllerLogin as useAuthLogin,
    useAuthControllerGetMe as useAuthMe,
    useAuthControllerRegister as useAuthRegister,
} from "@/shared/api/generated";
import { useAuthStore } from "../stores/auth.store";

export const useAuthLoginApi = (
    options?: Parameters<typeof useAuthLogin>[0],
) => {
    const setAuthentication = useAuthStore((s) => s.setAuthentication);

    return useAuthLogin({
        ...options,
        mutation: {
            onSuccess: async (data, variables, context, meta) => {
                setAuthentication(
                    data.accessToken ?? null,
                    data.refreshToken ?? null,
                    null
                );

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
                    const tokens = await authControllerLogin({
                        email: variables.data.email,
                        password: variables.data.password,
                    });

                    setAuthentication(
                        tokens.accessToken ?? null,
                        tokens.refreshToken ?? null,
                        null
                    );

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

export const useGetUserApi = useAuthMe;