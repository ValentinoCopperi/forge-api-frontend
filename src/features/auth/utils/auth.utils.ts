import type { AppErrorBody, ValidationErrorResponse } from "@/shared/api/generated";
import { isAxiosError } from "axios";

export const REMEMBER_EMAIL_KEY = "forge.remembered-email";

export function getRememberedEmail() {
    return localStorage.getItem(REMEMBER_EMAIL_KEY) ?? "";
}

export function persistRememberedEmail(email: string) {
    localStorage.setItem(REMEMBER_EMAIL_KEY, email);
}

export function clearRememberedEmail() {
    localStorage.removeItem(REMEMBER_EMAIL_KEY);
}

export function hasRememberedEmail() {
    return Boolean(localStorage.getItem(REMEMBER_EMAIL_KEY));
}

export function getAuthErrorMessage(
    error: unknown,
    fallback = "Unable to sign in. Please try again."
) {
    if (isAxiosError<AppErrorBody | ValidationErrorResponse>(error)) {
        const data = error.response?.data;

        if (data && "error" in data && data.error) {
            return data.error;
        }

        if (data && "errors" in data && data.errors) {
            const firstFieldError = Object.values(data.errors)[0]?.[0];
            if (firstFieldError) {
                return firstFieldError;
            }
        }
    }

    return fallback;
}
