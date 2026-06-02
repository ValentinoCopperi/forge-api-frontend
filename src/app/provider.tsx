import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense } from 'react'
import { routes } from './routes'
import { RouterProvider } from 'react-router-dom'
import { queryClient } from '@/shared/config/query-client/query-client'
import { Toaster } from '@/shared/ui/sonner'


export const AppProvider = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={routes} />


                {import.meta.env.DEV && (
                    <ReactQueryDevtools initialIsOpen={false} />
                )}

                <Toaster />
            </QueryClientProvider>
        </Suspense>
    )
}