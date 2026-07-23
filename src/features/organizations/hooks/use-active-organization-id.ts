import { useSyncExternalStore } from "react";
import { useParams } from "react-router-dom";
import {
    ACTIVE_ORG_CHANGE_EVENT,
    LAST_ORG_STORAGE_KEY,
} from "@/shared/components/sidebar/sidebar.constants";
import { resolveSelectedOrganizationId } from "@/shared/components/sidebar/sidebar.navigation";

function subscribeActiveOrganization(callback: () => void) {
    window.addEventListener(ACTIVE_ORG_CHANGE_EVENT, callback);

    return () => {
        window.removeEventListener(ACTIVE_ORG_CHANGE_EVENT, callback);
    };
}

function getStoredOrganizationIdSnapshot() {
    return localStorage.getItem(LAST_ORG_STORAGE_KEY);
}

export function resolveActiveOrganizationId(
    organizations: { id: number }[],
    orgIdParam?: string,
    storedOrgId?: string | null
): number | null {
    const candidates: number[] = [];

    const fromUrl = resolveSelectedOrganizationId(orgIdParam);
    if (fromUrl !== null) {
        candidates.push(fromUrl);
    }

    if (storedOrgId) {
        const parsed = Number(storedOrgId);
        if (!Number.isNaN(parsed)) {
            candidates.push(parsed);
        }
    }

    for (const id of candidates) {
        if (organizations.some((organization) => organization.id === id)) {
            return id;
        }
    }

    return null;
}

export function useActiveOrganizationId(
    organizations: { id: number }[]
): number | null {
    const { orgId: orgIdParam } = useParams();
    const storedOrgId = useSyncExternalStore(
        subscribeActiveOrganization,
        getStoredOrganizationIdSnapshot,
        getStoredOrganizationIdSnapshot
    );

    return resolveActiveOrganizationId(
        organizations,
        orgIdParam,
        storedOrgId
    );
}
