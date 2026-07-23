import { useParams } from "react-router-dom";
import { useOrganizationsControllerFindOne } from "@/features/organization-id/api";
import {
    MembersSection,
    OrgErrorState,
    OrgHero,
    OrgPageSkeleton,
    ProjectsSection,
} from "@/features/organization-id/components";
import { DashboardShell } from "@/features/dashboard";

export default function OrgPage() {
    const { orgId } = useParams<{ orgId: string }>();
    const id = Number(orgId);

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

    return (
        <DashboardShell>
            <OrgHero
                org={org}
                membersCount={org.OrganizationUser.length}
                projectsCount={org.Project.length}
                isRefreshing={isRefreshing}
                onRefresh={() => void refetch()}
            />
            <MembersSection members={org.OrganizationUser} orgId={org.id} />
            <ProjectsSection projects={org.Project} orgId={org.id} />
        </DashboardShell>
    );
}
