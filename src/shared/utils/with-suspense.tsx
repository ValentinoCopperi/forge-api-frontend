import {
    Suspense,
    type ComponentType,
    type LazyExoticComponent,
} from "react";

const withSuspense = <T extends object>(
    Component: LazyExoticComponent<ComponentType<T>>,
    props?: T
) => (
    <Suspense fallback={<div>Loading...</div>}>
        <Component {...(props ?? ({} as T))} />
    </Suspense>
);

export default withSuspense;
