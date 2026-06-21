/**
 * Utilidades compartidas para avatares e iniciales en la UI.
 * Usables por users, organizations, tasks, etc.
 */

/** Genera iniciales a partir del nombre o, en su defecto, de un texto alternativo. */
export function getInitials(name?: string, fallback?: string) {
    if (name?.trim()) {
        return name
            .split(" ")
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join("");
    }

    return fallback?.slice(0, 2).toUpperCase() ?? "?";
}

/**
 * Normaliza avatarUrl del API a un string usable por AvatarImage.
 * Soporta DTOs donde el campo puede ser string, null u objeto genérico.
 */
export function getAvatarSrc(avatarUrl?: unknown) {
    if (typeof avatarUrl === "string" && avatarUrl.trim()) {
        return avatarUrl;
    }

    return undefined;
}
