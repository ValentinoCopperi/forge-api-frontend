import { useState } from "react";
import { useParams } from "react-router-dom";
import { useOrganizationsControllerFindOne } from "@/features/organization-id/api";
import {
    MembersSection,
    OrgErrorState,
    OrgEditDialog,
    OrgHero,
    OrgPageSkeleton,
    ProjectsSection,
} from "@/features/organization-id/components";
import { DashboardShell } from "@/features/dashboard";
import { useAuthStore } from "@/features/auth/stores/auth.store";

export default function OrgPage() {
    const { orgId } = useParams<{ orgId: string }>();
    const id = Number(orgId);
    const [isEditing, setIsEditing] = useState(false);
    const currentUser = useAuthStore((state) => state.user);

    const { data: org, isLoading, isError, refetch, isFetching } =
        useOrganizationsControllerFindOne(id);

    const isRefreshing = isFetching && !isLoading;

    if (isLoading) return <OrgPageSkeleton />;

    if (isError || !org) {
        return (
            <DashboardShell>
                <OrgErrorState onRetry={() => void refetch()} />
            </DashboardShell>
        );
    }

    const currentMembership = org.OrganizationUser.find(
        (membership) => membership.User.id === currentUser?.id
    );
    const canEdit = currentMembership?.role === "OWNER";

    return (
        <DashboardShell>
            <OrgHero
                org={org}
                membersCount={org.OrganizationUser.length}
                projectsCount={org.Project.length}
                isRefreshing={isRefreshing}
                onRefresh={() => void refetch()}
                onEdit={() => setIsEditing(true)}
                canEdit={canEdit}
            />
            <MembersSection members={org.OrganizationUser} orgId={org.id} />
            <ProjectsSection projects={org.Project} orgId={org.id} />
            {isEditing ? (
                <OrgEditDialog organization={org} onClose={() => setIsEditing(false)} />
            ) : null}
        </DashboardShell>
    );
}
