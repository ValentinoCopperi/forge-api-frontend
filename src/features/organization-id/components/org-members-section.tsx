import { useMemo, useState } from "react";
import { UserPlus, Users } from "lucide-react";
import type { OrganizationMemberResponseDto } from "@/shared/api/generated";
import { DashboardCard } from "@/features/dashboard";
import { Button } from "@/shared/ui/button";
import { useOrgMemberMutations } from "../hooks";
import { AddMemberDialog } from "./org-add-member-dialog";
import { MembersTable } from "./org-members-table";
import { RemoveMemberDialog } from "./org-remove-member-dialog";
import { UpdateRoleDialog } from "./org-update-role-dialog";

type MembersSectionProps = {
    members: OrganizationMemberResponseDto[];
    orgId: number;
};

export function MembersSection({ members, orgId }: MembersSectionProps) {
    const [addOpen, setAddOpen] = useState(false);
    const [updateMember, setUpdateMember] =
        useState<OrganizationMemberResponseDto | null>(null);
    const [removeMember, setRemoveMember] =
        useState<OrganizationMemberResponseDto | null>(null);

    const memberUserIds = useMemo(
        () => new Set(members.map((m) => m.User.id)),
        [members]
    );

    const { addMutation, updateRoleMutation, removeMutation } =
        useOrgMemberMutations(orgId);

    return (
        <>
            <DashboardCard className="overflow-hidden p-0">
                {/* Card header */}
                <div className="flex items-center justify-between gap-4 border-b border-primary/10 bg-linear-to-r from-primary/6 to-transparent px-5 py-4 sm:px-6">
                    <div>
                        <h2 className="text-base font-bold tracking-tight text-foreground">
                            Members
                        </h2>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            {members.length}{" "}
                            {members.length === 1 ? "person" : "people"} in this
                            organization
                        </p>
                    </div>
                    <Button
                        type="button"
                        size="sm"
                        onClick={() => setAddOpen(true)}
                        className="shrink-0 shadow-md shadow-primary/20"
                    >
                        <UserPlus className="size-4" />
                        Add member
                    </Button>
                </div>

                {/* Table or empty state */}
                <div className="p-5 sm:p-6">
                    {members.length > 0 ? (
                        <MembersTable
                            members={members}
                            onUpdateRole={setUpdateMember}
                            onRemove={setRemoveMember}
                        />
                    ) : (
                        <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-6 py-12 text-center">
                            <Users className="mx-auto size-8 text-muted-foreground/40" />
                            <p className="mt-3 text-sm font-semibold text-muted-foreground">
                                No members yet
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground/60">
                                Add the first member using the button above.
                            </p>
                        </div>
                    )}
                </div>
            </DashboardCard>

            <AddMemberDialog
                open={addOpen}
                onOpenChange={(open) => {
                    if (!open) setAddOpen(false);
                    else setAddOpen(true);
                }}
                orgId={orgId}
                memberUserIds={memberUserIds}
                isPending={addMutation.isPending}
                onAdd={(data) => {
                    addMutation.mutate(data, {
                        onSuccess: () => setAddOpen(false),
                    });
                }}
            />
            <UpdateRoleDialog
                member={updateMember}
                onClose={() => setUpdateMember(null)}
                orgId={orgId}
                isPending={updateRoleMutation.isPending}
                onUpdate={(data) => {
                    updateRoleMutation.mutate(data, {
                        onSuccess: () => setUpdateMember(null),
                    });
                }}
            />
            <RemoveMemberDialog
                member={removeMember}
                onClose={() => setRemoveMember(null)}
                orgId={orgId}
                isPending={removeMutation.isPending}
                onRemove={(data) => {
                    removeMutation.mutate(data, {
                        onSuccess: () => setRemoveMember(null),
                    });
                }}
            />
        </>
    );
}
