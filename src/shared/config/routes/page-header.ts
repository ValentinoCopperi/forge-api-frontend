export type PageHeader = {
    title: string;
    subtitle: string;
};

export type PageHeaderResolver = (
    params: Readonly<Record<string, string | undefined>>
) => PageHeader;

export type PageHeaderHandle = {
    pageHeader?: PageHeader | PageHeaderResolver;
};

export function resolvePageHeader(
    handle: PageHeaderHandle | undefined,
    params: Readonly<Record<string, string | undefined>>
) {
    if (!handle?.pageHeader) {
        return undefined;
    }

    return typeof handle.pageHeader === "function"
        ? handle.pageHeader(params)
        : handle.pageHeader;
}
