import { useAuthStore } from "@/features/auth/stores/auth.store";
import { axiosInstance } from "./axios.instance";
import { toast } from "sonner";
import type { AxiosError } from "axios";






axiosInstance.interceptors.request.use(async (config) => {
    const authStore = useAuthStore.getState();
    const accessToken = authStore.accessToken;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});





axiosInstance.interceptors.response.use(async (response) => {
    return response;
}, (error: AxiosError<{ error: string }>) => {

    const status = error.response?.status;


    if (status === 429) {
        const errorMessage = error.response?.data?.error;
        toast.error(errorMessage ?? "Too many requests");
    }

    if (status === 500) {
        toast.error("Internal server error");
    }

    return Promise.reject(error);



});