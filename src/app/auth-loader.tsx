import { useGetUserApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { useEffect } from "react";


interface AuthLoaderProps {
    children: React.ReactNode;
    renderLoading: () => React.ReactNode;
}

export function AuthLoader({ children, renderLoading }: AuthLoaderProps) {

    const { data, isLoading } = useGetUserApi()

    const setAuthentication = useAuthStore((s) => s.setAuthentication);

    useEffect(() => {
        if (data) {
            setAuthentication(null , data);
        }
    }, [data]);

    if (isLoading) return renderLoading();
    
    return children;
}