import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import type { BreadcrumbItem } from "@/shared/config/routes/breadcrumbs";
import { cn } from "@/shared/utils/utils";

type AppBreadcrumbsProps = {
    items: BreadcrumbItem[];
};

export function AppBreadcrumbs({ items }: AppBreadcrumbsProps) {
    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex min-w-0 flex-wrap items-center gap-1.5">
                {items.map((item, index) => {
                    const isFirst = index === 0;
                    const isHomeLink = isFirst && item.href && item.label === "Home";

                    return (
                        <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
                            {index > 0 ? (
                                <ChevronRight
                                    className="size-3.5 shrink-0 text-muted-foreground/70"
                                    aria-hidden
                                />
                            ) : null}

                            {item.href ? (
                                <Link
                                    to={item.href}
                                    className={cn(
                                        "inline-flex min-w-0 max-w-48 items-center gap-1.5 truncate rounded-md px-1.5 py-0.5 text-sm font-medium text-muted-foreground transition-colors",
                                        "hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                                        isHomeLink && "max-w-none"
                                    )}
                                >
                                    {isHomeLink ? <Home className="size-3.5 shrink-0" /> : null}
                                    <span className="truncate">{item.label}</span>
                                </Link>
                            ) : (
                                <span
                                    className="inline-flex min-w-0 max-w-64 truncate px-1.5 py-0.5 text-sm font-semibold tracking-tight text-foreground"
                                    aria-current="page"
                                >
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
