import type { UserResponseDtoRoles } from "@/shared/api/generated";

/** Formatea el rol principal del usuario (ej. DIRECTOR → Director). */
export function formatUserRole(roles: UserResponseDtoRoles[]) {
    const role = roles[0];

    if (!role) {
        return "User";
    }

    return role.charAt(0) + role.slice(1).toLowerCase();
}
