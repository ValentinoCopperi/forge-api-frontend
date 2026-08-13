import { Search } from "lucide-react";
import { FieldInput } from "@/features/auth/components/FieldInput";
import {
    TASK_CATEGORY_LABELS,
    TASK_PRIORITY_LABELS,
    TASK_STATUS_LABELS,
} from "../utils/tasks.utils";
import type { TaskCategory, TaskPriority, TaskStatus } from "../types/tasks.types";

type TaskFiltersBarProps = {
    search: string;
    onSearchChange: (value: string) => void;
    status: TaskStatus | "";
    onStatusChange: (value: TaskStatus | "") => void;
    priority: TaskPriority | "";
    onPriorityChange: (value: TaskPriority | "") => void;
    category: TaskCategory | "";
    onCategoryChange: (value: TaskCategory | "") => void;
};

const selectClassName =
    "rounded-xl border border-border/80 bg-white/95 px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/15";

export function TaskFiltersBar({
    search,
    onSearchChange,
    status,
    onStatusChange,
    priority,
    onPriorityChange,
    category,
    onCategoryChange,
}: TaskFiltersBarProps) {
    return (
        <div className="flex flex-wrap items-center gap-2.5">
            <div className="max-w-sm flex-1 min-w-[200px]">
                <FieldInput
                    icon={Search}
                    placeholder="Search tasks by title..."
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                    aria-label="Search tasks"
                />
            </div>

            <select
                value={status}
                onChange={(event) =>
                    onStatusChange(event.target.value as TaskStatus | "")
                }
                className={selectClassName}
                aria-label="Filter by status"
            >
                <option value="">All statuses</option>
                {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>

            <select
                value={priority}
                onChange={(event) =>
                    onPriorityChange(event.target.value as TaskPriority | "")
                }
                className={selectClassName}
                aria-label="Filter by priority"
            >
                <option value="">All priorities</option>
                {Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>

            <select
                value={category}
                onChange={(event) =>
                    onCategoryChange(event.target.value as TaskCategory | "")
                }
                className={selectClassName}
                aria-label="Filter by category"
            >
                <option value="">All categories</option>
                {Object.entries(TASK_CATEGORY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                        {label}
                    </option>
                ))}
            </select>
        </div>
    );
}
