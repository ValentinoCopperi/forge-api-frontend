import { Link } from "react-router-dom";
import { ArrowRight, FolderKanban, ShieldCheck, Users } from "lucide-react";
import type { DashboardOrganization } from "../api/use-dashboard-data";
import { getProjectStatusTone, PROJECT_STATUS_LABELS } from "../utils/dashboard.utils";
import { pathBuilder } from "@/shared/config/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { cn } from "@/shared/utils/utils";

type DashboardOrganizationCardProps = {
    organization: DashboardOrganization;
};

export function DashboardOrganizationCard({ organization }: DashboardOrganizationCardProps) {
    const logoSrc = getAvatarSrc(organization.logoUrl);
    const currentProject = organization.projects[0];
    const previewMembers = organization.members.slice(0, 3);

    return (
        <article className="group grid min-w-0 gap-4 bg-card px-4 py-4 transition-colors hover:bg-surface-subtle/70 sm:px-5 lg:grid-cols-[minmax(220px,1.4fr)_minmax(210px,1fr)_auto] lg:items-center">
            <div className="flex min-w-0 items-center gap-3">
                <Avatar className="size-10 shrink-0 rounded-lg">
                    {logoSrc ? <AvatarImage src={logoSrc} alt={organization.name} /> : null}
                    <AvatarFallback className="rounded-lg bg-accent text-xs font-bold text-accent-foreground">
                        {getInitials(organization.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <Link to={pathBuilder.org(organization.id)} className="truncate text-sm font-bold text-foreground hover:text-primary">
                        {organization.name}
                    </Link>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {organization.description ?? "No organization description"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-5 gap-y-2 sm:grid-cols-4 lg:grid-cols-2">
                <LedgerValue icon={Users} label="Members" value={organization.memberCount} />
                <LedgerValue icon={FolderKanban} label="Projects" value={organization.projectCount} />
                <div className="col-span-2 hidden min-w-0 lg:block">
                    <p className="control-label">Latest project</p>
                    {currentProject ? (
                        <div className="mt-1 flex min-w-0 items-center gap-2">
                            <span className="truncate text-xs font-semibold text-foreground">{currentProject.name}</span>
                            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold", getProjectStatusTone(currentProject.status))}>
                                {PROJECT_STATUS_LABELS[currentProject.status]}
                            </span>
                        </div>
                    ) : <p className="mt-1 text-xs text-muted-foreground">No registered projects</p>}
                </div>
            </div>

            <div className="flex items-center justify-between gap-3 lg:justify-end">
                <div className="flex -space-x-1.5">
                    {previewMembers.map((member) => (
                        <Avatar key={member.id} className="size-7 border-2 border-card">
                            {getAvatarSrc(member.User.avatarUrl) ? <AvatarImage src={getAvatarSrc(member.User.avatarUrl)} alt={member.User.name} /> : null}
                            <AvatarFallback className="bg-muted text-[9px] font-bold text-muted-foreground">{getInitials(member.User.name)}</AvatarFallback>
                        </Avatar>
                    ))}
                </div>
                <Link to={pathBuilder.orgRoles(organization.id)} className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground" aria-label={`Manage roles in ${organization.name}`}>
                    <ShieldCheck className="size-4" />
                </Link>
                <Link to={pathBuilder.org(organization.id)} className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-bold text-primary-foreground shadow-sm hover:brightness-95">
                    Open <ArrowRight className="size-3.5" />
                </Link>
            </div>
        </article>
    );
}

function LedgerValue({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: number }) {
    return (
        <div className="flex items-center gap-2">
            <Icon className="size-3.5 text-muted-foreground" />
            <span className="text-sm font-extrabold tabular-nums text-foreground">{value}</span>
            <span className="text-[10px] font-semibold text-muted-foreground">{label}</span>
        </div>
    );
}
