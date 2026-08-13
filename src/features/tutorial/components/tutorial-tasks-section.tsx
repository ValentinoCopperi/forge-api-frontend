import { useState } from "react";
import {
    createTask,
    createTaskComment,
    deleteTask,
    deleteTaskComment,
    getTask,
    listTaskComments,
    listTasks,
    updateTask,
} from "@/features/tasks/api/tasks.api";
import type {
    TaskCategory,
    TaskPriority,
    TaskStatus,
} from "@/features/tasks/types/tasks.types";
import { API_PREFIX } from "@/shared/config/envs/env";
import { DashboardSectionHeader } from "@/features/dashboard/components/dashboard-card";
import { Label } from "@/shared/ui/label";
import { FieldInput } from "@/features/auth/components/FieldInput";
import { TutorialEndpointCard } from "./tutorial-endpoint-card";

const TASKS_PREFIX = `${API_PREFIX}/tasks`;

const STATUS_OPTIONS: TaskStatus[] = ["PENDING", "IN_PROGRESS", "DONE", "OVERDUE"];
const PRIORITY_OPTIONS: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];
const CATEGORY_OPTIONS: TaskCategory[] = [
    "DESARROLLO",
    "DISENO",
    "TESTING",
    "DOCUMENTACION",
    "OTRO",
];

export function TutorialTasksSection() {
    const [projectId, setProjectId] = useState("1");
    const [title, setTitle] = useState("Forge Demo Task");
    const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
    const [category, setCategory] = useState<TaskCategory>("OTRO");
    const [taskId, setTaskId] = useState("1");
    const [status, setStatus] = useState<TaskStatus>("IN_PROGRESS");
    const [commentContent, setCommentContent] = useState(
        "This is ready for review."
    );
    const [commentId, setCommentId] = useState("1");

    const parsedProjectId = Number(projectId);
    const parsedTaskId = Number(taskId);
    const parsedCommentId = Number(commentId);

    return (
        <section className="space-y-5">
            <DashboardSectionHeader
                title="Tasks"
                description="Tasks always belong to a project. Any organization member can create, read, update, or delete tasks and comments; comment deletion is limited to the author or an organization OWNER/ADMIN."
            />

            <div className="grid gap-5 xl:grid-cols-2">
                <TutorialEndpointCard
                    method="POST"
                    path={TASKS_PREFIX}
                    title="Create task"
                    description="Creates a task inside a project."
                    onRun={() => {
                        if (!parsedProjectId) {
                            throw new Error("Enter a valid project id.");
                        }

                        return createTask({
                            title,
                            projectId: parsedProjectId,
                            priority,
                            category,
                        });
                    }}
                >
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="create-task-project-id">
                                Project id
                            </Label>
                            <FieldInput
                                id="create-task-project-id"
                                type="number"
                                min={1}
                                value={projectId}
                                onChange={(event) =>
                                    setProjectId(event.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="create-task-title">Title</Label>
                            <FieldInput
                                id="create-task-title"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="create-task-priority">Priority</Label>
                            <select
                                id="create-task-priority"
                                value={priority}
                                onChange={(event) =>
                                    setPriority(event.target.value as TaskPriority)
                                }
                                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
                            >
                                {PRIORITY_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="create-task-category">Category</Label>
                            <select
                                id="create-task-category"
                                value={category}
                                onChange={(event) =>
                                    setCategory(event.target.value as TaskCategory)
                                }
                                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
                            >
                                {CATEGORY_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="GET"
                    path={`${TASKS_PREFIX}?projectId=`}
                    title="List tasks"
                    description="Returns tasks for a project, with optional status/priority/category/assignee/search filters."
                    onRun={() => {
                        if (!parsedProjectId) {
                            throw new Error("Enter a valid project id.");
                        }

                        return listTasks(parsedProjectId);
                    }}
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="list-tasks-project-id">Project id</Label>
                        <FieldInput
                            id="list-tasks-project-id"
                            type="number"
                            min={1}
                            value={projectId}
                            onChange={(event) => setProjectId(event.target.value)}
                        />
                    </div>
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="GET"
                    path={`${TASKS_PREFIX}/:id`}
                    title="Task detail"
                    description="Fetches a single task with creator, assigner, and assignee."
                    onRun={() => {
                        if (!parsedTaskId) {
                            throw new Error("Enter a valid task id.");
                        }

                        return getTask(parsedTaskId);
                    }}
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="task-id">Task id</Label>
                        <FieldInput
                            id="task-id"
                            type="number"
                            min={1}
                            value={taskId}
                            onChange={(event) => setTaskId(event.target.value)}
                        />
                    </div>
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="PATCH"
                    path={`${TASKS_PREFIX}/:id`}
                    title="Update task status"
                    description="Updates the task's status (also accepts title, priority, category, deadline, and assignee)."
                    onRun={() => {
                        if (!parsedTaskId) {
                            throw new Error("Enter a valid task id.");
                        }

                        return updateTask(parsedTaskId, { status });
                    }}
                >
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="update-task-id">Task id</Label>
                            <FieldInput
                                id="update-task-id"
                                type="number"
                                min={1}
                                value={taskId}
                                onChange={(event) => setTaskId(event.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="update-task-status">Status</Label>
                            <select
                                id="update-task-status"
                                value={status}
                                onChange={(event) =>
                                    setStatus(event.target.value as TaskStatus)
                                }
                                className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-3 focus:ring-primary/15"
                            >
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="DELETE"
                    path={`${TASKS_PREFIX}/:id`}
                    title="Delete task"
                    description="Permanently deletes the task and its comments."
                    note="Use a test task id. This action cannot be undone."
                    destructive
                    runLabel="Delete task"
                    onRun={() => {
                        if (!parsedTaskId) {
                            throw new Error("Enter a valid task id.");
                        }

                        return deleteTask(parsedTaskId);
                    }}
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="delete-task-id">Task id</Label>
                        <FieldInput
                            id="delete-task-id"
                            type="number"
                            min={1}
                            value={taskId}
                            onChange={(event) => setTaskId(event.target.value)}
                        />
                    </div>
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="GET"
                    path={`${TASKS_PREFIX}/:id/comments`}
                    title="List comments"
                    description="Returns all comments on a task, oldest first."
                    onRun={() => {
                        if (!parsedTaskId) {
                            throw new Error("Enter a valid task id.");
                        }

                        return listTaskComments(parsedTaskId);
                    }}
                >
                    <div className="space-y-1.5">
                        <Label htmlFor="list-comments-task-id">Task id</Label>
                        <FieldInput
                            id="list-comments-task-id"
                            type="number"
                            min={1}
                            value={taskId}
                            onChange={(event) => setTaskId(event.target.value)}
                        />
                    </div>
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="POST"
                    path={`${TASKS_PREFIX}/:id/comments`}
                    title="Add comment"
                    description="Adds a comment to a task."
                    onRun={() => {
                        if (!parsedTaskId) {
                            throw new Error("Enter a valid task id.");
                        }

                        return createTaskComment(parsedTaskId, commentContent);
                    }}
                >
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="create-comment-task-id">Task id</Label>
                            <FieldInput
                                id="create-comment-task-id"
                                type="number"
                                min={1}
                                value={taskId}
                                onChange={(event) => setTaskId(event.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="create-comment-content">Content</Label>
                            <FieldInput
                                id="create-comment-content"
                                value={commentContent}
                                onChange={(event) =>
                                    setCommentContent(event.target.value)
                                }
                            />
                        </div>
                    </div>
                </TutorialEndpointCard>

                <TutorialEndpointCard
                    method="DELETE"
                    path={`${TASKS_PREFIX}/:id/comments/:commentId`}
                    title="Delete comment"
                    description="Deletes a comment. Only the author or an organization OWNER/ADMIN can do this."
                    destructive
                    runLabel="Delete comment"
                    onRun={() => {
                        if (!parsedTaskId || !parsedCommentId) {
                            throw new Error(
                                "Enter a valid task id and comment id."
                            );
                        }

                        return deleteTaskComment(parsedTaskId, parsedCommentId);
                    }}
                >
                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="delete-comment-task-id">Task id</Label>
                            <FieldInput
                                id="delete-comment-task-id"
                                type="number"
                                min={1}
                                value={taskId}
                                onChange={(event) => setTaskId(event.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="delete-comment-id">Comment id</Label>
                            <FieldInput
                                id="delete-comment-id"
                                type="number"
                                min={1}
                                value={commentId}
                                onChange={(event) =>
                                    setCommentId(event.target.value)
                                }
                            />
                        </div>
                    </div>
                </TutorialEndpointCard>
            </div>
        </section>
    );
}
