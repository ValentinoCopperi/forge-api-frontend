import type { UserResponseDtoRoles } from "@/shared/api/generated";

/** Display labels for the backend's Spanish global role enum values. */
export const GLOBAL_ROLE_LABELS: Record<UserResponseDtoRoles, string> = {
    DIRECTOR: "Director",
    GERENTE: "Manager",
    EMPLEADO: "Employee",
};

/** Formatea el rol principal del usuario (ej. GERENTE → Manager). */
export function formatUserRole(
    roles: UserResponseDtoRoles | UserResponseDtoRoles[] | undefined
) {
    const list = Array.isArray(roles) ? roles : roles ? [roles] : [];
    const role = list[0];

    if (!role) {
        return "User";
    }

    return GLOBAL_ROLE_LABELS[role] ?? role;
}
