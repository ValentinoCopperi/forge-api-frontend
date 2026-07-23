export const LAST_ORG_STORAGE_KEY = "forge.last-org";

export const ACTIVE_ORG_CHANGE_EVENT = "forge:active-org-change";

export function notifyActiveOrganizationChange() {
    window.dispatchEvent(new Event(ACTIVE_ORG_CHANGE_EVENT));
}
