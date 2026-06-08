import type { ApiErrorResponseDto } from "@/shared/api/generated";
import { isAxiosError } from "axios";

export function parseApiErrorMessage(
    message: ApiErrorResponseDto["message"] | undefined | null
) {
    if (!message) {
        return undefined;
    }

    if (typeof message === "string") {
        return message;
    }

    const normalized = message.map((item) => item.trim()).filter(Boolean);

    return normalized.length > 0 ? normalized.join(", ") : undefined;
}

export function getApiErrorMessage(
    error: unknown,
    fallback = "Something went wrong. Please try again."
) {
    if (isAxiosError<ApiErrorResponseDto>(error)) {
        const parsed = parseApiErrorMessage(error.response?.data?.message);

        if (parsed) {
            return parsed;
        }
    }

    return fallback;
}
