import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense } from 'react'
import { routes } from './routes'
import { RouterProvider } from 'react-router-dom'
import { queryClient } from '@/shared/config/query-client/query-client'
import { AppErrorBoundary } from '@/shared/components/errors/app-error'
import { AppLoader } from '@/shared/components/loaders/app-loader'
import { Toaster } from '@/shared/ui/sonner'
import { ErrorBoundary } from 'react-error-boundary'


export const AppProvider = () => {
    return (
        <Suspense fallback={<AppLoader />}>
            <ErrorBoundary FallbackComponent={AppErrorBoundary}>
                <QueryClientProvider client={queryClient}>
                    <RouterProvider router={routes} />


                    {import.meta.env.DEV && (
                        <ReactQueryDevtools initialIsOpen={false} />
                    )}

                    <Toaster />
                </QueryClientProvider>
            </ErrorBoundary>
        </Suspense>
    )
}