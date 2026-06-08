import { getApiErrorMessage } from "@/shared/api/utils/api-error.utils";

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
    return getApiErrorMessage(error, fallback);
}
