import { AuthPageBackground } from "@/features/auth/components/AuthPageBackground";

type AuthPageLayoutProps = {
    children: React.ReactNode;
};

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
    return (
        <div className="relative min-h-svh overflow-hidden">
            <AuthPageBackground />

            <div className="relative flex min-h-svh items-center justify-center px-4 py-10 sm:justify-end sm:px-8 lg:px-16 xl:px-24">
                {children}
            </div>
        </div>
    );
}
