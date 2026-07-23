import {
    authControllerGetMe,
    authControllerRefresh,
} from "@/shared/api/generated";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { API_PREFIX } from "@/shared/config/envs/env";
import { DashboardSectionHeader } from "@/features/dashboard/components/dashboard-card";
import { TutorialEndpointCard } from "./tutorial-endpoint-card";

const AUTH_PREFIX = `${API_PREFIX}/auth`;

export function TutorialAuthSection() {
    const accessToken = useAuthStore((state) => state.accessToken);

    return (
        <section className="space-y-5">
            <DashboardSectionHeader
                title="Authentication"
                description="Forge uses short-lived access tokens with refresh cookies. Protected routes send Authorization: Bearer automatically."
            />

            <div className="grid gap-5 xl:grid-cols-2">
                <TutorialEndpointCard
                    method="POST"
                    path={`${AUTH_PREFIX}/register`}
                    title="Register"
                    description="Creates a new user and returns an accessToken plus a refresh_token cookie."
                    note="You are already signed in. Use the register page if you need a fresh account."
                    disabled
                    runLabel="Disabled while signed in"
                    onRun={async () => ({ info: "Use /register to create a new account." })}
                />

                <TutorialEndpointCard
                    method="POST"
                    path={`${AUTH_PREFIX}/login`}
                    title="Login"
                    description="Authenticates an existing user with the same token + cookie response as register."
                    note="Your current session is active. Logging in again would replace it."
                    disabled
                    runLabel="Disabled while signed in"
                    onRun={async () => ({ info: "Use /login to sign in with another account." })}
                />

                <TutorialEndpointCard
                    method="GET"
                    path={`${AUTH_PREFIX}/me`}
                    title="Current user"
                    description="Returns the authenticated profile. Requires Authorization: Bearer accessToken."
                    badge="Recommended"
                    onRun={async () => {
                        const user = await authControllerGetMe();
                        useAuthStore.setState({ user });
                        return user;
                    }}
                />

                <TutorialEndpointCard
                    method="POST"
                    path={`${AUTH_PREFIX}/refresh`}
                    title="Refresh token"
                    description="Reads the refresh_token cookie and returns a new accessToken without credentials in the body."
                    note={`Current token preview: ${accessToken ? `${accessToken.slice(0, 18)}...` : "none"}`}
                    onRun={async () => {
                        const tokens = await authControllerRefresh();
                        useAuthStore.setState({
                            accessToken: tokens.accessToken ?? null,
                        });
                        return tokens;
                    }}
                />

                <TutorialEndpointCard
                    method="POST"
                    path={`${AUTH_PREFIX}/logout`}
                    title="Logout"
                    description="Revokes the session in the database and clears the refresh cookie."
                    note="This will sign you out and redirect to login. Use the profile menu for a normal logout."
                    destructive
                    disabled
                    runLabel="Use profile menu instead"
                    onRun={async () => ({
                        info: "Logout is available from the user menu to avoid accidental sign-out.",
                    })}
                />
            </div>
        </section>
    );
}
