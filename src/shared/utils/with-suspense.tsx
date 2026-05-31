import { Suspense } from "react"





const withSuspense = <T extends object>(
    Component: React.LazyExoticComponent<React.ComponentType<T>>,
    props?: T
) => (
    <Suspense fallback={<div>Loading...</div>}>
        <Component {...(props ?? {} as T)} />
    </Suspense>
)

export default withSuspense