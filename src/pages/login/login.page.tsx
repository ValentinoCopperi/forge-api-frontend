import { AuthPageLayout, GoogleIcon, LoginForm } from "@/features/auth";

export default function LoginPage() {
    return (
        <AuthPageLayout>
            <LoginForm googleIcon={<GoogleIcon />} />
        </AuthPageLayout>
    );
}
