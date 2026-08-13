import { BookOpen, Sparkles } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { formatUserRole } from "@/shared/utils/role.utils";

export function TutorialPageHeader() {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="dashboard-hero-surface p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                    <div className="eyebrow">
                        <Sparkles className="size-3.5" />
                        Interactive API guide
                    </div>
                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Learn Forge by trying the API
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                        Explore how authentication, organizations, and avatars work.
                        Each section explains the endpoints and lets you send real
                        requests against the backend.
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <div className="flex items-center gap-3">
                        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <BookOpen className="size-4.5" />
                        </span>
                        <div>
                            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                Signed in as
                            </p>
                            <p className="mt-1 text-sm font-semibold text-foreground">
                                {user?.name ?? "Unknown user"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {user?.roles
                                    ? formatUserRole(user.roles)
                                    : "No role assigned"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
