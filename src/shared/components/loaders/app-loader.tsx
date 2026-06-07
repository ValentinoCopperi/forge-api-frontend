import { Spinner } from "@/shared/ui/spinner"

export function AppLoader() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-3">
            <Spinner className="size-8 text-primary" />
            <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
    )
}
