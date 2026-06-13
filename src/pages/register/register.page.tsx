import { AuthPageLayout, GoogleIcon, RegisterForm } from "@/features/auth";

export default function RegisterPage() {
    return (
        <AuthPageLayout>
            <RegisterForm googleIcon={<GoogleIcon />} />
        </AuthPageLayout>
    );
}
