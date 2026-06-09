import { useAuthStore } from "../stores/auth.store";
import { Navigate } from "react-router-dom";
import { paths } from "@/shared/config/routes";




export function RoutesGuard({ children }: { children: React.ReactNode }) {


    const user = useAuthStore((state) => state.user);

    if (!user) {
        return <Navigate to={paths.login} />;
    }

    return children;

}