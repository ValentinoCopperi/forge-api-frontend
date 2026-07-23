import { FolderKanban, ListTodo } from "lucide-react";
import { DashboardCard, DashboardSectionHeader } from "@/features/dashboard/components/dashboard-card";

const ROADMAP_ITEMS = [
    {
        icon: FolderKanban,
        title: "Projects",
        status: "Not implemented yet",
        bullets: [
            "Create and list projects inside an organization",
            "Assign a project manager",
            "Update and delete project records",
        ],
    },
    {
        icon: ListTodo,
        title: "Tasks",
        status: "Not implemented yet",
        bullets: [
            "CRUD scoped to a project",
            "Dynamic filters by status, priority, and category",
            "Assignment with designatedTo and comments",
            "Scheduled job that marks overdue tasks as OVERDUE",
        ],
    },
];

export function TutorialRoadmapSection() {
    return (
        <section className="space-y-5">
            <DashboardSectionHeader
                title="Coming soon"
                description="These modules are part of the Forge roadmap. The UI routes already exist, but the interactive API playground will be added once the backend endpoints are ready."
            />

            <div className="grid gap-5 xl:grid-cols-2">
                {ROADMAP_ITEMS.map((item) => {
                    const Icon = item.icon;

                    return (
                        <DashboardCard
                            key={item.title}
                            className="relative overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 size-28 rounded-full bg-primary/10" />
                            <div className="relative space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                        <Icon className="size-5" />
                                    </span>
                                    <span className="rounded-full border border-border bg-muted/40 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                                        {item.status}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                                        {item.title}
                                    </h3>
                                    <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                                        {item.bullets.map((bullet) => (
                                            <li
                                                key={bullet}
                                                className="flex gap-2"
                                            >
                                                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" />
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </DashboardCard>
                    );
                })}
            </div>
        </section>
    );
}
