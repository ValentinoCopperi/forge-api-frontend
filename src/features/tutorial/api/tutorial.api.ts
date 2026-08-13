import { authControllerGetMe } from "@/shared/api/generated";
import { axiosInstance } from "@/shared/api/axios/axios.instance";
import { API_BASE_URL, API_PREFIX } from "@/shared/config/envs/env";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export async function uploadUserAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post(
        `${API_BASE_URL}${API_PREFIX}/users/upload`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    const user = await authControllerGetMe();
    useAuthStore.setState({ user });

    return response.data ?? { message: "Avatar uploaded successfully" };
}
