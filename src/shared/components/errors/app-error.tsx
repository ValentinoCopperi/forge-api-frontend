import { Button } from "@/shared/ui/button"
import type { FallbackProps } from "react-error-boundary"
import { useNavigate, useRouteError } from "react-router-dom"

type AppErrorProps = {
    error: unknown
    onRetry?: () => void
}

export function AppError({ error, onRetry }: AppErrorProps) {
    const message =
        error instanceof Error
            ? error.message
            : "An unexpected error occurred."

    return (
        <div className="flex min-h-svh flex-col items-center justify-center p-6">
            <div className="w-full max-w-md rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
                <h1 className="text-lg font-semibold text-destructive">Something went wrong</h1>
                <p className="mt-2 text-sm text-muted-foreground">{message}</p>
                {onRetry && (
                    <Button className="mt-4" variant="outline" onClick={onRetry}>
                        Try again
                    </Button>
                )}
            </div>
        </div>
    )
}

export function AppErrorBoundary({ error, resetErrorBoundary }: FallbackProps) {
    return <AppError error={error} onRetry={resetErrorBoundary} />
}

export function AppRouteError() {
    const error = useRouteError()
    const navigate = useNavigate()

    return <AppError error={error} onRetry={() => navigate(0)} />
}
