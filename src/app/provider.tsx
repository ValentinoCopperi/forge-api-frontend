import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense } from 'react'
import { routes } from './routes'
import { RouterProvider } from 'react-router-dom'

const queryClient = new QueryClient()


export const AppProvider = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={routes} />


                {import.meta.env.DEV && (
                    <ReactQueryDevtools initialIsOpen={false} />
                )}
            </QueryClientProvider>
        </Suspense>
    )
}