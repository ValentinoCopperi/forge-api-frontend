import { useAuthStore } from "@/features/auth/stores/auth.store";
import { axiosInstance } from "./axios.instance";
import { toast } from "sonner";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authRefresh } from "../generated";

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

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

        if (status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => retryRequest(originalRequest, token));
            }

            isRefreshing = true;

            const { refreshToken: refresh_token } = useAuthStore.getState();

            try {
                const { accessToken } = await authRefresh({ refresh_token: refresh_token! });

                useAuthStore.setState({ accessToken });

                processQueue(null, accessToken!);

                return retryRequest(originalRequest, accessToken!);
            } catch (refreshError) {
                processQueue(refreshError as AxiosError, null);

                // Logica logout TO-DO

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
