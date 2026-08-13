export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE" | "OVERDUE";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskCategory =
    | "DESARROLLO"
    | "DISENO"
    | "TESTING"
    | "DOCUMENTACION"
    | "OTRO";

export type TaskUserSummary = {
    id: number;
    name: string;
    email: string;
    avatarUrl: string | null;
};

export type TaskListItem = {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    category: TaskCategory;
    priority: TaskPriority;
    deadline: string | null;
    projectId: number | null;
    createdAt: string;
    updatedAt: string;
    User_Task_createdByToUser: TaskUserSummary;
    User_Task_designatedByToUser: TaskUserSummary | null;
    User_Task_designatedToToUser: TaskUserSummary | null;
    _count: { TaskComment: number };
};

export type TaskDetail = TaskListItem;

export type TaskComment = {
    id: number;
    content: string;
    taskId: number;
    createdAt: string;
    updatedAt: string;
    User: TaskUserSummary;
};

export type CreateTaskPayload = {
    title: string;
    description?: string;
    projectId: number;
    status?: TaskStatus;
    category?: TaskCategory;
    priority?: TaskPriority;
    deadline?: string;
    designatedTo?: number;
};

export type UpdateTaskPayload = Partial<Omit<CreateTaskPayload, "projectId">>;

export type TaskFilters = {
    status?: TaskStatus;
    priority?: TaskPriority;
    category?: TaskCategory;
    designatedTo?: number;
    search?: string;
};
