import { useState } from "react";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import { DashboardCard, DashboardSectionHeader } from "@/features/dashboard";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { Spinner } from "@/shared/ui/spinner";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { cn } from "@/shared/utils/utils";
import { useTaskComments } from "../api/tasks.api";
import { useTaskCommentMutations } from "../hooks/use-task-comment-mutations";

type TaskCommentsSectionProps = {
    taskId: number;
    currentUserId?: number;
    canModerate?: boolean;
};

export function TaskCommentsSection({
    taskId,
    currentUserId,
    canModerate = false,
}: TaskCommentsSectionProps) {
    const [content, setContent] = useState("");
    const commentsQuery = useTaskComments(taskId);
    const { createMutation, deleteMutation } = useTaskCommentMutations(taskId);

    const comments = commentsQuery.data?.data ?? [];

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const trimmed = content.trim();
        if (!trimmed) return;

        createMutation.mutate(trimmed, {
            onSuccess: () => setContent(""),
        });
    };

    return (
        <DashboardCard>
            <DashboardSectionHeader
                title="Comments"
                description={`${comments.length} ${comments.length === 1 ? "comment" : "comments"}`}
            />

            <div className="mt-5 space-y-4">
                {commentsQuery.isLoading ? (
                    <div className="space-y-3">
                        <Skeleton className="h-14 w-full" />
                        <Skeleton className="h-14 w-full" />
                    </div>
                ) : comments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-6 py-8 text-center">
                        <MessageSquare className="mx-auto size-7 text-muted-foreground/40" />
                        <p className="mt-2 text-sm text-muted-foreground">
                            No comments yet.
                        </p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {comments.map((comment) => {
                            const avatarSrc = getAvatarSrc(comment.User.avatarUrl);
                            const canDelete =
                                canModerate || comment.User.id === currentUserId;

                            return (
                                <li
                                    key={comment.id}
                                    className="flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/15 p-3.5"
                                >
                                    <Avatar className="size-8 shrink-0 border border-border">
                                        {avatarSrc ? (
                                            <AvatarImage
                                                src={avatarSrc}
                                                alt={comment.User.name}
                                            />
                                        ) : null}
                                        <AvatarFallback className="bg-muted text-[10px] font-semibold text-muted-foreground">
                                            {getInitials(comment.User.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-semibold text-foreground">
                                                {comment.User.name}
                                            </p>
                                            {canDelete ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        deleteMutation.mutate(
                                                            comment.id
                                                        )
                                                    }
                                                    disabled={deleteMutation.isPending}
                                                    className="text-muted-foreground/60 transition-colors hover:text-destructive disabled:opacity-50"
                                                    aria-label="Delete comment"
                                                >
                                                    <Trash2 className="size-3.5" />
                                                </button>
                                            ) : null}
                                        </div>
                                        <p className="mt-0.5 text-sm leading-6 text-muted-foreground">
                                            {comment.content}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}

                <form onSubmit={handleSubmit} className="flex items-start gap-2">
                    <textarea
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                        placeholder="Write a comment..."
                        rows={2}
                        disabled={createMutation.isPending}
                        className={cn(
                            "w-full resize-none rounded-xl border border-border/80 bg-white/95 px-3 py-2.5 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-3 focus:ring-primary/15"
                        )}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={createMutation.isPending || !content.trim()}
                        className="shrink-0"
                    >
                        {createMutation.isPending ? (
                            <Spinner className="size-4" />
                        ) : (
                            <Send className="size-4" />
                        )}
                    </Button>
                </form>
            </div>
        </DashboardCard>
    );
}
