export function formatResponsePayload(payload: unknown) {
    if (payload === undefined) {
        return "No response body";
    }

    try {
        return JSON.stringify(payload, null, 2);
    } catch {
        return String(payload);
    }
}
