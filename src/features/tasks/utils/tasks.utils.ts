import type { TaskCategory, TaskPriority, TaskStatus } from "../types/tasks.types";

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
    PENDING: "Pending",
    IN_PROGRESS: "In progress",
    DONE: "Done",
    OVERDUE: "Overdue",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
};

export const TASK_CATEGORY_LABELS: Record<TaskCategory, string> = {
    DESARROLLO: "Development",
    DISENO: "Design",
    TESTING: "Testing",
    DOCUMENTACION: "Documentation",
    OTRO: "Other",
};

export function getTaskStatusTone(status: TaskStatus) {
    if (status === "DONE") {
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
    }

    if (status === "IN_PROGRESS") {
        return "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300";
    }

    if (status === "OVERDUE") {
        return "border-destructive/20 bg-destructive/10 text-destructive";
    }

    return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300";
}

export function getTaskPriorityTone(priority: TaskPriority) {
    if (priority === "HIGH") {
        return "border-destructive/20 bg-destructive/10 text-destructive";
    }

    if (priority === "MEDIUM") {
        return "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300";
    }

    return "border-muted bg-muted text-muted-foreground";
}

export function formatTaskDate(value?: string | null) {
    if (!value) {
        return "No date";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "No date";
    }

    return new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}
