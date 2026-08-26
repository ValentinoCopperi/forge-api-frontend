import { useRef, useState } from "react";
import { ImageUp, Upload } from "lucide-react";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { API_PREFIX } from "@/shared/config/envs/env";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { DashboardSectionHeader } from "@/features/dashboard/components/dashboard-card";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { uploadUserAvatar } from "../api/tutorial.api";
import { TutorialEndpointCard } from "./tutorial-endpoint-card";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function TutorialAvatarSection() {
    const user = useAuthStore((state) => state.user);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);

    const avatarSrc = getAvatarSrc(user?.avatarUrl);
    const initials = getInitials(user?.name, user?.email);

    const handleFileChange = (file: File | null) => {
        setValidationError(null);

        if (!file) {
            setSelectedFile(null);
            return;
        }

        if (!ACCEPTED_TYPES.includes(file.type)) {
            setValidationError("Only JPEG, PNG, or WEBP files are allowed.");
            setSelectedFile(null);
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setValidationError("The file must be 5 MB or smaller.");
            setSelectedFile(null);
            return;
        }

        setSelectedFile(file);
    };

    return (
        <section className="space-y-5">
            <DashboardSectionHeader
                title="Avatar"
                description="Upload a profile image with multipart/form-data. The backend stores it in MinIO and replaces any previous avatar."
            />

            <div className="rounded-xl bg-card p-5 shadow-sm">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <Avatar className="size-20">
                        {avatarSrc ? (
                            <AvatarImage src={avatarSrc} alt={user?.name ?? "User"} />
                        ) : null}
                        <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground">
                            Current avatar
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Accepted formats: JPEG, PNG, WEBP. Maximum size: 5 MB.
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={ACCEPTED_TYPES.join(",")}
                            className="hidden"
                            onChange={(event) =>
                                handleFileChange(event.target.files?.[0] ?? null)
                            }
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="size-4" />
                            Choose image
                        </Button>
                        {selectedFile ? (
                            <p className="text-xs text-muted-foreground">
                                Selected: {selectedFile.name} (
                                {(selectedFile.size / 1024).toFixed(1)} KB)
                            </p>
                        ) : null}
                        {validationError ? (
                            <p className="text-xs text-destructive">
                                {validationError}
                            </p>
                        ) : null}
                    </div>
                </div>
            </div>

            <TutorialEndpointCard
                method="POST"
                path={`${API_PREFIX}/users/upload`}
                title="Upload avatar"
                description="Sends multipart/form-data with a single file field. The previous avatar is replaced in MinIO when one already exists."
                badge="Live upload"
                disabled={!selectedFile}
                runLabel={selectedFile ? "Upload avatar" : "Select a file first"}
                onRun={async () => {
                    if (!selectedFile) {
                        throw new Error("Select an image before uploading.");
                    }

                    return uploadUserAvatar(selectedFile);
                }}
            >
                <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border/80 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
                    <ImageUp className="size-4 shrink-0 text-primary" />
                    <span>
                        Field name: <code className="font-mono text-xs">file</code>.
                        After a successful upload,{" "}
                        <code className="font-mono text-xs">GET /auth/me</code> is
                        called to refresh your profile in the app.
                    </span>
                </div>
            </TutorialEndpointCard>
        </section>
    );
}
