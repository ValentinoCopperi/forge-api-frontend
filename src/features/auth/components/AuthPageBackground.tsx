import { Zap } from "lucide-react";

const BACKGROUND_IMAGE = "/met-background.jpg";

export function AuthPageBackground() {
    return (
        <>
            <div className="absolute inset-0 bg-[#001018]" aria-hidden />

            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}
                aria-hidden
            />

            {/* Depth + legibility over bright city lights */}
            <div
                className="absolute inset-0 bg-linear-to-r from-[#001018]/92 via-[#001018]/45 to-[#001018]/65"
                aria-hidden
            />

            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(6,182,212,0.18),transparent_60%)]"
                aria-hidden
            />

            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_50%,rgba(0,8,16,0.55),transparent_45%)]"
                aria-hidden
            />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 lg:pr-[42%]">
                <div className="flex flex-col items-center text-center text-white">
                    <div className="relative mb-5 size-32">
                        <svg
                            viewBox="0 0 120 120"
                            className="absolute inset-0 size-full text-cyan-300/70"
                            aria-hidden
                        >
                            <ellipse
                                cx="60"
                                cy="58"
                                rx="46"
                                ry="18"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeDasharray="3 7"
                                transform="rotate(-12 60 58)"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="flex size-16 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-950/40 shadow-lg shadow-cyan-950/40 backdrop-blur-md">
                                <Zap className="size-8 text-cyan-200" />
                            </span>
                        </div>
                    </div>

                    <p className="text-4xl font-semibold tracking-[0.35em] text-white drop-shadow-sm sm:text-5xl">
                        FORGE
                    </p>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed tracking-wide text-cyan-100/80">
                        Enterprise management platform for modern operations teams
                    </p>
                </div>
            </div>
        </>
    );
}
