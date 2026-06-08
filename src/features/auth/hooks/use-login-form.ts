import { useAuthLoginApi } from "@/features/auth/api/auth.api";
import {
    CUSTOM_EMAIL_VALUE,
    getDemoAccountByEmail,
    getInitialEmailSelection,
    LOGIN_DEMO_ACCOUNTS,
    type LoginEmailSelection,
} from "@/features/auth/constants/login-demo-accounts";
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

function getDefaultFormValues(): LoginFormValues {
    const rememberedEmail = getRememberedEmail();
    const demoAccount = getDemoAccountByEmail(rememberedEmail);

    if (demoAccount) {
        return {
            email: demoAccount.email,
            password: demoAccount.password,
            remember: hasRememberedEmail(),
        };
    }

    if (rememberedEmail) {
        return {
            email: rememberedEmail,
            password: "",
            remember: true,
        };
    }

    const defaultAccount = LOGIN_DEMO_ACCOUNTS[0];

    return {
        email: defaultAccount.email,
        password: defaultAccount.password,
        remember: false,
    };
}

export function useLoginForm() {
    const navigate = useNavigate();
    const defaultValues = getDefaultFormValues();
    const [showPassword, setShowPassword] = useState(false);
    const [formInfo, setFormInfo] = useState<string | null>(null);
    const [emailSelection, setEmailSelection] = useState<LoginEmailSelection>(
        getInitialEmailSelection(defaultValues.email)
    );

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
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues,
    });

    const isCustomEmail = emailSelection === CUSTOM_EMAIL_VALUE;

    const applyDemoAccount = (selection: LoginEmailSelection) => {
        if (selection === CUSTOM_EMAIL_VALUE) {
            setValue("email", "");
            setValue("password", "");
            return;
        }

        const account = LOGIN_DEMO_ACCOUNTS.find((item) => item.value === selection);

        if (account) {
            setValue("email", account.email);
            setValue("password", account.password);
        }
    };

    const handleEmailSelectionChange = (selection: LoginEmailSelection) => {
        clearFormFeedback();
        setEmailSelection(selection);
        applyDemoAccount(selection);
    };

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
        emailSelection,
        handleEmailSelectionChange,
        isCustomEmail,
    };
}
