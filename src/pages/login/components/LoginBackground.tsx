import { Zap } from "lucide-react";

const EARTH_IMAGE =
    "https://images.unsplash.com/photo-1614730321146-b6f5bcef1519?auto=format&fit=crop&w=2400&q=80";

export function LoginBackground() {
    return (
        <>
            <div className="absolute inset-0 bg-[#020617]" aria-hidden />

            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
                style={{ backgroundImage: `url('${EARTH_IMAGE}')` }}
                aria-hidden
            />

            <div
                className="absolute inset-0 bg-linear-to-r from-[#020617]/95 via-[#020617]/55 to-[#020617]/20"
                aria-hidden
            />

            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_45%_55%,rgba(14,116,144,0.35),transparent_55%)]"
                aria-hidden
            />

            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(45,212,191,0.12),transparent_45%)]"
                aria-hidden
            />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
                <div className="flex flex-col items-center text-center text-white/90">
                    <div className="relative mb-4 size-28">
                        <svg
                            viewBox="0 0 120 120"
                            className="absolute inset-0 size-full opacity-80"
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
                            <span className="flex size-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm">
                                <Zap className="size-7 text-teal-300" />
                            </span>
                        </div>
                    </div>

                    <p className="text-4xl font-semibold tracking-[0.35em]">FORGE</p>
                    <p className="mt-2 text-sm tracking-wide text-white/70">
                        Enterprise API Platform
                    </p>
                </div>
            </div>
        </>
    );
}
