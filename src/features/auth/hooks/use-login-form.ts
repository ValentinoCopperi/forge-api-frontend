import { useAuthLoginApi } from "@/features/auth/api/auth.api";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/login.schema";
import {
    clearRememberedEmail,
    getAuthErrorMessage,
    getRememberedEmail,
    hasRememberedEmail,
    persistRememberedEmail,
} from "@/features/auth/utils/auth.utils";
import { paths } from "@/shared/config/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function useLoginForm() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formInfo, setFormInfo] = useState<string | null>(null);

    const loginMutation = useAuthLoginApi({
        mutation: {
            onSuccess: () => {
                navigate(paths.dashboard);
            },
        },
    });

    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: getRememberedEmail(),
            password: "",
            remember: hasRememberedEmail(),
        },
    });

    const clearFormFeedback = () => {
        clearErrors("root");
        setFormInfo(null);
    };

    const showForgotPasswordInfo = () => {
        clearErrors("root");
        setFormInfo("Contact your administrator to recover your account.");
    };

    const showGoogleSignInInfo = () => {
        clearErrors("root");
        setFormInfo("Google sign-in will be available soon.");
    };

    const onSubmit = handleSubmit((values) => {
        clearFormFeedback();

        if (values.remember) {
            persistRememberedEmail(values.email);
        } else {
            clearRememberedEmail();
        }

        loginMutation.mutate(
            { data: { email: values.email, password: values.password } },
            {
                onError: (error) => {
                    setError("root", {
                        message: getAuthErrorMessage(error),
                    });
                },
            }
        );
    });

    return {
        register,
        errors,
        onSubmit,
        showPassword,
        setShowPassword,
        formInfo,
        clearFormFeedback,
        showForgotPasswordInfo,
        showGoogleSignInInfo,
        isPending: loginMutation.isPending,
    };
}
