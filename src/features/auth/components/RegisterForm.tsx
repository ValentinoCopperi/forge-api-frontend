import { FormAlert } from "@/features/auth/components/FormAlert";
import { FieldInput } from "@/features/auth/components/FieldInput";
import { useRegisterForm } from "@/features/auth/hooks/use-register-form";
import { paths } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { Spinner } from "@/shared/ui/spinner";
import { Eye, EyeOff, Mail, User, Zap } from "lucide-react";
import { Link } from "react-router-dom";

type RegisterFormProps = {
    googleIcon: React.ReactNode;
};

export function RegisterForm({ googleIcon }: RegisterFormProps) {
    const {
        register,
        errors,
        onSubmit,
        showPassword,
        setShowPassword,
        formInfo,
        clearFormFeedback,
        showGoogleSignInInfo,
        isPending,
    } = useRegisterForm();

    return (
        <div className="w-full max-w-md rounded-2xl border border-white/25 bg-white/90 p-6 shadow-2xl shadow-cyan-950/25 backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Zap className="size-5" />
                </span>
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-foreground">
                        Welcome to Forge!
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Create your account to access your Forge workspace.
                    </p>
                </div>
            </div>

            {errors.root?.message ? (
                <FormAlert message={errors.root.message} />
            ) : formInfo ? (
                <FormAlert message={formInfo} variant="info" />
            ) : null}

            <form className="mt-4 space-y-4" onSubmit={onSubmit} noValidate>
                <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <FieldInput
                        id="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Jane Doe"
                        icon={User}
                        error={errors.name?.message}
                        {...register("name", { onChange: clearFormFeedback })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <FieldInput
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        icon={Mail}
                        error={errors.email?.message}
                        {...register("email", { onChange: clearFormFeedback })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <FieldInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        error={errors.password?.message}
                        endAdornment={
                            <button
                                type="button"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                                aria-label={
                                    showPassword ? "Hide password" : "Show password"
                                }
                                onClick={() => setShowPassword((visible) => !visible)}
                            >
                                {showPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        }
                        {...register("password", { onChange: clearFormFeedback })}
                    />
                </div>

                <Button
                    type="submit"
                    className="h-11 w-full rounded-xl bg-[#0f766e] text-base hover:bg-[#0d6b64]"
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <Spinner className="size-4" />
                            Creating account...
                        </>
                    ) : (
                        "Sign up"
                    )}
                </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to={paths.login} className="font-medium text-primary hover:underline">
                    Sign in
                </Link>
            </p>

            <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-border/80" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border/80" />
            </div>

            <Button
                type="button"
                variant="outline"
                className="h-11 w-full rounded-xl bg-white/90"
                onClick={showGoogleSignInInfo}
            >
                {googleIcon}
                Sign up with Google
            </Button>

            <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
                By continuing, you agree to our{" "}
                <Link to="#" className="text-primary hover:underline">
                    Terms
                </Link>{" "}
                and{" "}
                <Link to="#" className="text-primary hover:underline">
                    Privacy Policy
                </Link>
                .
            </p>

            <p className="mt-4 text-center text-[11px] text-muted-foreground/80">
                © Forge — {new Date().getFullYear()}
            </p>
        </div>
    );
}
