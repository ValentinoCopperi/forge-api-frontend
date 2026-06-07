import { LoginForm } from "@/features/auth";
import { GoogleIcon } from "./components/GoogleIcon";
import { LoginBackground } from "./components/LoginBackground";

export default function LoginPage() {
    return (
        <div className="relative min-h-svh overflow-hidden">
            <LoginBackground />

            <div className="relative flex min-h-svh items-center justify-center px-4 py-10 sm:justify-end sm:px-8 lg:px-16 xl:px-24">
                <LoginForm googleIcon={<GoogleIcon />} />
            </div>
        </div>
    );
}
