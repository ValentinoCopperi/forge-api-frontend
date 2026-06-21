import { useGetUserApi } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { isPublicAuthPath } from "@/shared/config/routes";

interface AuthLoaderProps {
    children: React.ReactNode;
    renderLoading: () => React.ReactNode;
}

export function AuthLoader({ children, renderLoading }: AuthLoaderProps) {
    const shouldRestoreSession = !isPublicAuthPath(window.location.pathname);

    const { data, isLoading } = useGetUserApi({
        query: {
            enabled: shouldRestoreSession,
            retry: false,
        },
    });

    if (shouldRestoreSession && isLoading) {
        return renderLoading();
    }

    if (data) {
        const { user, setAuthentication } = useAuthStore.getState();

        if (user?.id !== data.id) {
            setAuthentication(null, data);
        }
    }

    return children;
}
