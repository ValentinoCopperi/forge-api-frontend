import { useAuthStore } from "@/features/auth/stores/auth.store";
import { axiosInstance } from "./axios.instance";
import { toast } from "sonner";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authControllerRefresh as authRefresh } from "../generated";
import { isPublicAuthPath, paths } from "@/shared/config/routes";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

/** Rutas donde un 401 es respuesta final, no token expirado */
const AUTH_ROUTES_WITHOUT_REFRESH = [
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
    "/auth/logout",
] as const;

function shouldSkipTokenRefresh(config: InternalAxiosRequestConfig) {
    const url = config.url ?? "";
    return AUTH_ROUTES_WITHOUT_REFRESH.some((route) => url.includes(route));
}

function shouldAttemptTokenRefresh(config: InternalAxiosRequestConfig | undefined) {
    if (!config || shouldSkipTokenRefresh(config)) {
        return false;
    }

    return !isPublicAuthPath(window.location.pathname);
}

axiosInstance.interceptors.request.use(async (config) => {
    const authStore = useAuthStore.getState();
    const accessToken = authStore.accessToken;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

let isRefreshing = false;

let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token!);
        }
    });
    failedQueue = [];
};

const retryRequest = (config: RetryableRequestConfig, token: string) => {
    config.headers.Authorization = `Bearer ${token}`;
    return axiosInstance(config);
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ error: string }>) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;
        const status = error.response?.status;

        if (
            status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            shouldAttemptTokenRefresh(originalRequest)
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => retryRequest(originalRequest, token));
            }

            isRefreshing = true;


            try {
                const { accessToken } = await authRefresh();

                useAuthStore.setState({ accessToken });

                processQueue(null, accessToken!);

                return retryRequest(originalRequest, accessToken!);
            } catch (refreshError) {
                processQueue(refreshError as AxiosError, null);

                useAuthStore.setState({ user: null });
                useAuthStore.setState({ accessToken: null });

                if (!isPublicAuthPath(window.location.pathname)) {
                    window.location.replace(paths.login);
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        if (status === 429) {
            const errorMessage = error.response?.data?.error;
            toast.error(errorMessage ?? "Too many requests");
        }

        if (status === 500) {
            toast.error("Internal server error");
        }

        return Promise.reject(error);
    },
);
