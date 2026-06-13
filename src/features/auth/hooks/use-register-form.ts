import { useAuthRegisterApi } from "@/features/auth/api/auth.api";
import {
    registerSchema,
    type RegisterFormValues,
} from "@/features/auth/schemas/register.schema";
import { getAuthErrorMessage } from "@/features/auth/utils/auth.utils";
import { paths } from "@/shared/config/routes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function useRegisterForm() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formInfo, setFormInfo] = useState<string | null>(null);

    const registerMutation = useAuthRegisterApi({
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
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const clearFormFeedback = () => {
        clearErrors("root");
        setFormInfo(null);
    };

    const showGoogleSignInInfo = () => {
        clearErrors("root");
        setFormInfo("Google sign-up will be available soon.");
    };

    const onSubmit = handleSubmit((values) => {
        clearFormFeedback();

        registerMutation.mutate(
            {
                data: {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                },
            },
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
        showGoogleSignInInfo,
        isPending: registerMutation.isPending,
    };
}
