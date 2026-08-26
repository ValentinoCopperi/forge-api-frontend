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
                className="absolute inset-0 bg-linear-to-r from-[#090615]/92 via-[#171038]/42 to-[#090615]/72"
                aria-hidden
            />

            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_45%_45%,rgba(91,79,240,0.2),transparent_58%)]"
                aria-hidden
            />

            <div
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_50%,rgba(0,8,16,0.55),transparent_45%)]"
                aria-hidden
            />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 lg:pr-[42%]">
                <div className="flex flex-col items-center text-center text-white">
                    <span className="relative mb-6 flex size-14 items-center justify-center rounded-xl bg-forge-purple text-white shadow-md">
                        <Zap className="size-7" />
                        <span className="absolute -right-1 -bottom-1 size-3.5 rounded-full border-[3px] border-[#13102c] bg-forge-lime" />
                    </span>

                    <p className="text-4xl font-extrabold tracking-[0.25em] text-white drop-shadow-sm sm:text-5xl">
                        FORGE
                    </p>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/72">
                        Enterprise management platform for modern operations teams
                    </p>
                </div>
            </div>
        </>
    );
}
