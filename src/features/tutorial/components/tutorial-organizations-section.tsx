import { useState } from "react";
import {
    AddUserToOrganizationDtoRole,
    organizationsControllerAddUserToOrganization,
    organizationsControllerCreate,
    organizationsControllerFindAll,
    organizationsControllerFindOne,
    organizationsControllerRemove,
    organizationsControllerRemoveUserFromOrganization,
    organizationsControllerUpdate,
    organizationsControllerUpdateUserOrganizationRole,
    UpdateUserOrganizationRoleDtoRole,
    UserResponseDtoRoles,
} from "@/shared/api/generated";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { API_PREFIX } from "@/shared/config/envs/env";
import { DashboardSectionHeader } from "@/features/dashboard/components/dashboard-card";
import { Label } from "@/shared/ui/label";
import { FieldInput } from "@/features/auth/components/FieldInput";
import { TutorialEndpointCard } from "./tutorial-endpoint-card";

const ORG_PREFIX = `${API_PREFIX}/organizations`;

export function TutorialOrganizationsSection() {
    const user = useAuthStore((state) => state.user);
    const isDirector = user?.roles.includes(UserResponseDtoRoles.DIRECTOR);

    const [createName, setCreateName] = useState("Forge Demo Org");
    const [createDescription, setCreateDescription] = useState(
        "Organization created from the tutorial page."
    );
    const [organizationId, setOrganizationId] = useState("1");
    const [updateName, setUpdateName] = useState("");
    const [updateDescription, setUpdateDescription] = useState("");
    const [memberEmail, setMemberEmail] = useState("");
    const [memberUserId, setMemberUserId] = useState("");
    const [memberRole, setMemberRole] = useState<AddUserToOrganizationDtoRole>(
        AddUserToOrganizationDtoRole.MEMBER
    );
    const [updatedRole, setUpdatedRole] = useState<UpdateUserOrganizationRoleDtoRole>(
        UpdateUserOrganizationRoleDtoRole.ADMIN
    );

    const parsedOrganizationId = Number(organizationId);
    const parsedMemberUserId = memberUserId ? Number(memberUserId) : undefined;

    return (
        <section className="space-y-5">
            <DashboardSectionHeader
                title="Organizations"
                description="Workspace management is restricted to users with the global DIRECTOR role for creation, while update/delete actions depend on organization roles."
            />

            {!isDirector ? (
                <p className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm leading-6 text-amber-900 dark:text-amber-200">
                    Your account is not a global DIRECTOR. You can still read
                    organizations you belong to, but create/delete actions may
                    return forbidden responses.
                </p>
            ) : null}

            <div className="grid gap-5 xl:grid-cols-2">
                <TutorialEndpointCard
                    method="POST"
                    path={ORG_PREFIX}
                    title="Create organization"
                    description="Creates a workspace and assigns the creator as OWNER."
                    badge={isDirector ? "DIRECTOR" : "May fail"}
                    onRun={() =>
                        organizationsControllerCreate({
                            name: createName,
                            description: createDescription,
                        })
                    }
                >
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="create-org-name">Name</Label>
                            <FieldInput
                                id="create-org-name"
                                value={createName}
                                onChange={(event) =>
                                    setCreateName(event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="create-org-description">
                                Description
                            </Label>
                            <FieldInput
                                id="create-org-description"
                                value={createDescription}
                                onChange={(event) =>
                                    setCreateDescription(event.target.value)
                                }
                            />
                        </div>
                    </div>
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="GET"
                    path={ORG_PREFIX}
                    title="List organizations"
                    description="Returns every organization visible to the current user."
                    badge="Recommended"
                    onRun={() => organizationsControllerFindAll()}
                />

                <TutorialEndpointCard
                    method="GET"
                    path={`${ORG_PREFIX}/:id`}
                    title="Organization detail"
                    description="Fetches a single organization with members, projects, and metadata."
                    onRun={() => {
                        if (!parsedOrganizationId) {
                            throw new Error("Enter a valid organization id.");
                        }

                        return organizationsControllerFindOne(parsedOrganizationId);
                    }}
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="organization-id">Organization id</Label>
                        <FieldInput
                            id="organization-id"
                            type="number"
                            min={1}
                            value={organizationId}
                            onChange={(event) =>
                                setOrganizationId(event.target.value)
                            }
                        />
                    </div>
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="PATCH"
                    path={`${ORG_PREFIX}/:id`}
                    title="Update organization"
                    description="Updates name or description. Requires update permission (OWNER or ADMIN)."
                    onRun={() => {
                        if (!parsedOrganizationId) {
                            throw new Error("Enter a valid organization id.");
                        }

                        return organizationsControllerUpdate(parsedOrganizationId, {
                            name: updateName || undefined,
                            description: updateDescription || undefined,
                        });
                    }}
                >
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="update-org-id">Organization id</Label>
                            <FieldInput
                                id="update-org-id"
                                type="number"
                                min={1}
                                value={organizationId}
                                onChange={(event) =>
                                    setOrganizationId(event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="update-org-name">New name</Label>
                            <FieldInput
                                id="update-org-name"
                                placeholder="Optional"
                                value={updateName}
                                onChange={(event) =>
                                    setUpdateName(event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="update-org-description">
                                New description
                            </Label>
                            <FieldInput
                                id="update-org-description"
                                placeholder="Optional"
                                value={updateDescription}
                                onChange={(event) =>
                                    setUpdateDescription(event.target.value)
                                }
                            />
                        </div>
                    </div>
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="POST"
                    path={`${ORG_PREFIX}/add-user`}
                    title="Add user"
                    description="Adds a member by email or user id with a specific organization role."
                    note="Requires the add-user action on the organization."
                    onRun={() => {
                        if (!parsedOrganizationId) {
                            throw new Error("Enter a valid organization id.");
                        }

                        if (!memberEmail && !parsedMemberUserId) {
                            throw new Error("Provide an email or user id.");
                        }

                        return organizationsControllerAddUserToOrganization({
                            organizationId: parsedOrganizationId,
                            email: memberEmail || undefined,
                            userId: parsedMemberUserId,
                            role: memberRole,
                        });
                    }}
                >
                    <OrganizationMemberFields
                        organizationId={organizationId}
                        onOrganizationIdChange={setOrganizationId}
                        memberEmail={memberEmail}
                        onMemberEmailChange={setMemberEmail}
                        memberUserId={memberUserId}
                        onMemberUserIdChange={setMemberUserId}
                        role={memberRole}
                        onRoleChange={setMemberRole}
                    />
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="DELETE"
                    path={`${ORG_PREFIX}/remove-user`}
                    title="Remove user"
                    description="Removes a member from the organization by email or user id."
                    note="Requires the remove-user action."
                    destructive
                    onRun={() => {
                        if (!parsedOrganizationId) {
                            throw new Error("Enter a valid organization id.");
                        }

                        if (!memberEmail && !parsedMemberUserId) {
                            throw new Error("Provide an email or user id.");
                        }

                        return organizationsControllerRemoveUserFromOrganization({
                            organizationId: parsedOrganizationId,
                            email: memberEmail || undefined,
                            userId: parsedMemberUserId,
                        });
                    }}
                >
                    <OrganizationMemberFields
                        organizationId={organizationId}
                        onOrganizationIdChange={setOrganizationId}
                        memberEmail={memberEmail}
                        onMemberEmailChange={setMemberEmail}
                        memberUserId={memberUserId}
                        onMemberUserIdChange={setMemberUserId}
                        role={memberRole}
                        onRoleChange={setMemberRole}
                        showRole={false}
                    />
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="PATCH"
                    path={`${ORG_PREFIX}/update-user-role`}
                    title="Update member role"
                    description="Changes a member role inside the organization. Only OWNER can perform this action."
                    onRun={() => {
                        if (!parsedOrganizationId) {
                            throw new Error("Enter a valid organization id.");
                        }

                        if (!memberEmail && !parsedMemberUserId) {
                            throw new Error("Provide an email or user id.");
                        }

                        return organizationsControllerUpdateUserOrganizationRole({
                            organizationId: parsedOrganizationId,
                            email: memberEmail || undefined,
                            userId: parsedMemberUserId,
                            role: updatedRole,
                        });
                    }}
                >
                    <div className="space-y-3">
                        <OrganizationMemberFields
                            organizationId={organizationId}
                            onOrganizationIdChange={setOrganizationId}
                            memberEmail={memberEmail}
                            onMemberEmailChange={setMemberEmail}
                            memberUserId={memberUserId}
                            onMemberUserIdChange={setMemberUserId}
                            role={memberRole}
                            onRoleChange={setMemberRole}
                            showRole={false}
                        />
                        <div className="space-y-1.5">
                            <Label htmlFor="updated-role">New role</Label>
                            <select
                                id="updated-role"
                                value={updatedRole}
                                onChange={(event) =>
                                    setUpdatedRole(
                                        event.target
                                            .value as UpdateUserOrganizationRoleDtoRole
                                    )
                                }
                                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
                            >
                                {Object.values(UpdateUserOrganizationRoleDtoRole).map(
                                    (role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="DELETE"
                    path={`${ORG_PREFIX}/:id`}
                    title="Delete organization"
                    description="Permanently deletes the organization. Only the OWNER can delete it."
                    note="Use a test organization id. This action cannot be undone."
                    destructive
                    runLabel="Delete organization"
                    onRun={() => {
                        if (!parsedOrganizationId) {
                            throw new Error("Enter a valid organization id.");
                        }

                        return organizationsControllerRemove(parsedOrganizationId);
                    }}
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="delete-org-id">Organization id</Label>
                        <FieldInput
                            id="delete-org-id"
                            type="number"
                            min={1}
                            value={organizationId}
                            onChange={(event) =>
                                setOrganizationId(event.target.value)
                            }
                        />
                    </div>
                </TutorialEndpointCard>
            </div>
        </section>
    );
}

type OrganizationMemberFieldsProps = {
    organizationId: string;
    onOrganizationIdChange: (value: string) => void;
    memberEmail: string;
    onMemberEmailChange: (value: string) => void;
    memberUserId: string;
    onMemberUserIdChange: (value: string) => void;
    role: AddUserToOrganizationDtoRole;
    onRoleChange: (value: AddUserToOrganizationDtoRole) => void;
    showRole?: boolean;
};

function OrganizationMemberFields({
    organizationId,
    onOrganizationIdChange,
    memberEmail,
    onMemberEmailChange,
    memberUserId,
    onMemberUserIdChange,
    role,
    onRoleChange,
    showRole = true,
}: OrganizationMemberFieldsProps) {
    return (
        <div className="space-y-3">
            <div className="space-y-1.5">
                <Label htmlFor="member-org-id">Organization id</Label>
                <FieldInput
                    id="member-org-id"
                    type="number"
                    min={1}
                    value={organizationId}
                    onChange={(event) =>
                        onOrganizationIdChange(event.target.value)
                    }
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="member-email">Member email</Label>
                <FieldInput
                    id="member-email"
                    type="email"
                    placeholder="Optional if user id is provided"
                    value={memberEmail}
                    onChange={(event) => onMemberEmailChange(event.target.value)}
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="member-user-id">Member user id</Label>
                <FieldInput
                    id="member-user-id"
                    type="number"
                    min={1}
                    placeholder="Optional if email is provided"
                    value={memberUserId}
                    onChange={(event) =>
                        onMemberUserIdChange(event.target.value)
                    }
                />
            </div>
            {showRole ? (
                <div className="space-y-1.5">
                    <Label htmlFor="member-role">Role</Label>
                    <select
                        id="member-role"
                        value={role}
                        onChange={(event) =>
                            onRoleChange(
                                event.target.value as AddUserToOrganizationDtoRole
                            )
                        }
                        className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
                    >
                        {Object.values(AddUserToOrganizationDtoRole).map(
                            (option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            )
                        )}
                    </select>
                </div>
            ) : null}
        </div>
    );
}
