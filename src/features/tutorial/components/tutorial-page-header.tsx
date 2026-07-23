import { BookOpen, Sparkles } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { formatUserRole } from "@/shared/utils/role.utils";

export function TutorialPageHeader() {
    const user = useAuthStore((state) => state.user);

    return (
        <header className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
            <div className="absolute inset-y-0 right-0 w-1/2 bg-linear-to-l from-primary/15 to-transparent" />
            <div className="absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        <Sparkles className="size-3.5" />
                        Interactive API guide
                    </div>
                    <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                        Learn Forge by trying the API
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                        Explore how authentication, organizations, and avatars work.
                        Each section explains the endpoints and lets you send real
                        requests against the backend.
                    </p>
                </div>

                <div className="rounded-3xl border border-border bg-background/70 p-5 backdrop-blur">
                    <div className="flex items-center gap-3">
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <BookOpen className="size-5" />
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
