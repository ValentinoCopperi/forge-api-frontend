import { paths } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { ArrowLeft, Home, Zap } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background px-6 py-12">
            {/* Fondo decorativo */}
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.12),transparent_55%)]"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full bg-primary/5 blur-3xl"
                aria-hidden
            />
            <div
                className="pointer-events-none absolute -bottom-24 left-0 size-72 rounded-full bg-primary/5 blur-3xl"
                aria-hidden
            />

            <div className="relative w-full max-w-lg text-center">
                {/* Marca */}
                <div className="mx-auto mb-8 flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                    <Zap className="size-5" />
                </div>

                {/* Código 404 */}
                <p className="text-7xl font-bold tracking-tight text-primary/20 sm:text-8xl">
                    404
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    Page not found
                </h1>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    The page you are looking for does not exist or may have been
                    moved. Check the URL or return to a safe area of Forge.
                </p>

                {location.pathname ? (
                    <p className="mt-4 inline-block max-w-full truncate rounded-lg border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs text-muted-foreground">
                        {location.pathname}
                    </p>
                ) : null}

                {/* Acciones */}
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Button asChild size="lg">
                        <Link to={paths.dashboard}>
                            <Home data-icon="inline-start" />
                            Go to Dashboard
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft data-icon="inline-start" />
                        Go back
                    </Button>
                </div>
            </div>
        </div>
    );
}
