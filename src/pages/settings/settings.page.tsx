import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Mail, Settings as SettingsIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { uploadUserAvatar } from "@/features/tutorial/api/tutorial.api";
import { useOrganizationsControllerFindAllByUserId } from "@/shared/api/generated";
import { DashboardCard, DashboardHero, DashboardSectionHeader, DashboardShell } from "@/features/dashboard";
import { GlobalRoleBadge, normalizeUserRoles } from "@/features/organizations";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { Spinner } from "@/shared/ui/spinner";
import { pathBuilder } from "@/shared/config/routes";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { formatDashboardDate, MEMBER_ROLE_LABELS } from "@/features/dashboard/utils/dashboard.utils";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function SettingsPage() {
    const user = useAuthStore((state) => state.user);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const orgsQuery = useOrganizationsControllerFindAllByUserId();
    const organizations = orgsQuery.data?.data ?? [];

    const avatarSrc = getAvatarSrc(user?.avatarUrl);
    const initials = getInitials(user?.name, user?.email);
    const primaryRole = normalizeUserRoles(user?.roles)[0];

    const handleFileSelect = async (file: File | null) => {
        if (!file) return;

        if (!ACCEPTED_TYPES.includes(file.type)) {
            toast.error("Only JPEG, PNG, or WEBP files are allowed.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error("The file must be 5 MB or smaller.");
            return;
        }

        setIsUploading(true);

        try {
            await uploadUserAvatar(file);
            toast.success("Avatar updated");
        } catch {
            toast.error("Could not upload avatar", {
                description: "Verify the file and try again.",
            });
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <DashboardShell>
            <DashboardHero
                badge={{ icon: SettingsIcon, label: "Account" }}
                title="Settings"
                description="Manage your profile and see the organizations you belong to."
            />

            <DashboardCard>
                <DashboardSectionHeader
                    title="Profile"
                    description="Your account details, as seen across the workspace."
                />

                <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
                    <Avatar className="size-20 shrink-0 rounded-3xl border-4 border-card shadow-xl shadow-primary/15">
                        {avatarSrc ? (
                            <AvatarImage src={avatarSrc} alt={user?.name ?? "User"} />
                        ) : null}
                        <AvatarFallback className="rounded-3xl bg-primary/15 text-2xl font-bold text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="text-lg font-bold text-foreground">
                                {user?.name}
                            </p>
                            {primaryRole ? <GlobalRoleBadge role={primaryRole} /> : null}
                        </div>
                        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Mail className="size-3.5 shrink-0" />
                            {user?.email}
                        </p>

                        <div className="pt-1">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={ACCEPTED_TYPES.join(",")}
                                className="hidden"
                                onChange={(event) =>
                                    void handleFileSelect(event.target.files?.[0] ?? null)
                                }
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isUploading}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {isUploading ? (
                                    <>
                                        <Spinner className="size-4" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="size-4" />
                                        Change avatar
                                    </>
                                )}
                            </Button>
                            <p className="mt-1.5 text-xs text-muted-foreground">
                                JPEG, PNG, or WEBP. Maximum size 5 MB.
                            </p>
                        </div>
                    </div>
                </div>
            </DashboardCard>

            <DashboardCard>
                <DashboardSectionHeader
                    title="Your organizations"
                    description={`${organizations.length} ${organizations.length === 1 ? "organization" : "organizations"} you belong to`}
                />

                <div className="mt-6">
                    {orgsQuery.isLoading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-14 w-full" />
                            <Skeleton className="h-14 w-full" />
                        </div>
                    ) : organizations.length === 0 ? (
                        <p className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-6 py-8 text-center text-sm text-muted-foreground">
                            You are not part of any organization yet.
                        </p>
                    ) : (
                        <ul className="space-y-2.5">
                            {organizations.map((org) => (
                                <li key={org.id}>
                                    <Link
                                        to={pathBuilder.org(org.id)}
                                        className="group flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/20 px-4 py-3 transition-all hover:border-primary/25 hover:bg-primary/5"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                                                {org.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Member since {formatDashboardDate(org.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2">
                                            <span className="rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                                                {MEMBER_ROLE_LABELS[org.role]}
                                            </span>
                                            <ExternalLink className="size-3.5 text-transparent transition-colors group-hover:text-muted-foreground" />
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </DashboardCard>
        </DashboardShell>
    );
}
