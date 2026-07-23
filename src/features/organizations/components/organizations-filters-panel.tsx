import { useMemo, useState } from "react";
import { Check, ChevronDown, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { FieldInput } from "@/features/auth/components/FieldInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import { Label } from "@/shared/ui/label";
import { getAvatarSrc, getInitials } from "@/shared/utils/avatar.utils";
import { cn } from "@/shared/utils/utils";
import {
    ORGANIZATION_ROLE_FILTER_OPTIONS,
    type OrganizationFilterUser,
    type OrganizationFilters,
    type OrganizationRoleFilter,
} from "../types/organization-filters.types";
import { countActiveOrganizationFilters } from "../utils/organization-filters.utils";
import {
    getOrganizationRoleTone,
    ORGANIZATION_ROLE_LABELS,
} from "../utils/organizations.utils";

type OrganizationsFiltersToggleProps = {
    open: boolean;
    activeCount: number;
    onToggle: () => void;
};

export function OrganizationsFiltersToggle({
    open,
    activeCount,
    onToggle,
}: OrganizationsFiltersToggleProps) {
    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            aria-expanded={open}
            onClick={onToggle}
            className={cn(
                "border-primary/20 bg-background/80 hover:border-primary/35 hover:bg-primary/5",
                open && "border-primary/35 bg-primary/5 text-primary"
            )}
        >
            <SlidersHorizontal className="size-4" />
            Filters
            {activeCount > 0 ? (
                <span className="ml-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {activeCount}
                </span>
            ) : null}
            <ChevronDown
                className={cn(
                    "size-4 transition-transform duration-300",
                    open && "rotate-180"
                )}
            />
        </Button>
    );
}

type OrganizationsFiltersPanelProps = {
    open: boolean;
    filters: OrganizationFilters;
    creators: OrganizationFilterUser[];
    onChange: (filters: OrganizationFilters) => void;
    onReset: () => void;
    resultCount: number;
    totalCount: number;
};

export function OrganizationsFiltersPanel({
    open,
    filters,
    creators,
    onChange,
    onReset,
    resultCount,
    totalCount,
}: OrganizationsFiltersPanelProps) {
    const activeCount = countActiveOrganizationFilters(filters);

    const updateFilters = (patch: Partial<OrganizationFilters>) => {
        onChange({ ...filters, ...patch });
    };

    const toggleRole = (role: OrganizationRoleFilter) => {
        const roles = filters.roles.includes(role)
            ? filters.roles.filter((item) => item !== role)
            : [...filters.roles, role];

        updateFilters({ roles });
    };

    const toggleCreator = (creatorId: number) => {
        const creatorIds = filters.creatorIds.includes(creatorId)
            ? filters.creatorIds.filter((id) => id !== creatorId)
            : [...filters.creatorIds, creatorId];

        updateFilters({ creatorIds });
    };

    return (
        <div
            className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
        >
            <div className="overflow-hidden">
                <div className="border-b border-primary/10 bg-muted/20 px-5 py-3 sm:px-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-xs text-muted-foreground">
                            <span className="font-semibold text-primary">
                                {resultCount}
                            </span>{" "}
                            of {totalCount} ·{" "}
                            {activeCount === 0
                                ? "no filters"
                                : `${activeCount} active`}
                        </p>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            disabled={activeCount === 0}
                            onClick={onReset}
                        >
                            <RotateCcw className="size-3" />
                            Clear
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <FilterField label="Your role">
                            <div className="flex flex-wrap gap-1.5">
                                {ORGANIZATION_ROLE_FILTER_OPTIONS.map((option) => {
                                    const isSelected = filters.roles.includes(
                                        option.value
                                    );
                                    const tone =
                                        option.value === "NOT_MEMBER"
                                            ? "border-muted-foreground/25 bg-muted/50 text-muted-foreground"
                                            : getOrganizationRoleTone(
                                                  option.value
                                              );

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                toggleRole(option.value)
                                            }
                                            className={cn(
                                                "rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors",
                                                isSelected
                                                    ? cn(
                                                          tone,
                                                          "ring-1 ring-primary/20"
                                                      )
                                                    : "border-border bg-background text-muted-foreground hover:border-primary/20 hover:text-foreground"
                                            )}
                                        >
                                            {option.value === "NOT_MEMBER"
                                                ? option.label
                                                : ORGANIZATION_ROLE_LABELS[
                                                      option.value
                                                  ]}
                                        </button>
                                    );
                                })}
                            </div>
                        </FilterField>

                        <CreatorMultiSelect
                            creators={creators}
                            selectedIds={filters.creatorIds}
                            onToggle={toggleCreator}
                        />

                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            <FilterField label="Created">
                                <div className="grid grid-cols-2 gap-2">
                                    <CompactDateInput
                                        id="filter-created-from"
                                        placeholder="From"
                                        value={filters.createdFrom}
                                        onChange={(createdFrom) =>
                                            updateFilters({ createdFrom })
                                        }
                                    />
                                    <CompactDateInput
                                        id="filter-created-to"
                                        placeholder="To"
                                        value={filters.createdTo}
                                        onChange={(createdTo) =>
                                            updateFilters({ createdTo })
                                        }
                                    />
                                </div>
                            </FilterField>

                            <FilterField label="Updated">
                                <div className="grid grid-cols-2 gap-2">
                                    <CompactDateInput
                                        id="filter-updated-from"
                                        placeholder="From"
                                        value={filters.updatedFrom}
                                        onChange={(updatedFrom) =>
                                            updateFilters({ updatedFrom })
                                        }
                                    />
                                    <CompactDateInput
                                        id="filter-updated-to"
                                        placeholder="To"
                                        value={filters.updatedTo}
                                        onChange={(updatedTo) =>
                                            updateFilters({ updatedTo })
                                        }
                                    />
                                </div>
                            </FilterField>

                            <FilterField label="Members">
                                <div className="grid grid-cols-2 gap-2">
                                    <CompactNumberInput
                                        id="filter-members-min"
                                        placeholder="Min"
                                        value={filters.membersMin}
                                        onChange={(membersMin) =>
                                            updateFilters({ membersMin })
                                        }
                                    />
                                    <CompactNumberInput
                                        id="filter-members-max"
                                        placeholder="Max"
                                        value={filters.membersMax}
                                        onChange={(membersMax) =>
                                            updateFilters({ membersMax })
                                        }
                                    />
                                </div>
                            </FilterField>

                            <FilterField label="Projects">
                                <div className="grid grid-cols-2 gap-2">
                                    <CompactNumberInput
                                        id="filter-projects-min"
                                        placeholder="Min"
                                        value={filters.projectsMin}
                                        onChange={(projectsMin) =>
                                            updateFilters({ projectsMin })
                                        }
                                    />
                                    <CompactNumberInput
                                        id="filter-projects-max"
                                        placeholder="Max"
                                        value={filters.projectsMax}
                                        onChange={(projectsMax) =>
                                            updateFilters({ projectsMax })
                                        }
                                    />
                                </div>
                            </FilterField>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FilterField({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                {label}
            </Label>
            {children}
        </div>
    );
}

function CreatorMultiSelect({
    creators,
    selectedIds,
    onToggle,
}: {
    creators: OrganizationFilterUser[];
    selectedIds: number[];
    onToggle: (creatorId: number) => void;
}) {
    const [query, setQuery] = useState("");

    const filteredCreators = useMemo(() => {
        const normalized = query.trim().toLowerCase();

        if (!normalized) {
            return creators;
        }

        return creators.filter(
            (creator) =>
                creator.name.toLowerCase().includes(normalized) ||
                creator.email.toLowerCase().includes(normalized)
        );
    }, [creators, query]);

    return (
        <FilterField label="Created by">
            <div className="rounded-xl border border-border/80 bg-background">
                <div className="border-b border-border/60 p-2">
                    <FieldInput
                        icon={Search}
                        placeholder="Search users..."
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        className="h-9"
                        aria-label="Search creators"
                    />
                </div>

                <div className="max-h-28 overflow-y-auto p-1.5">
                    {filteredCreators.length === 0 ? (
                        <p className="px-2 py-3 text-center text-xs text-muted-foreground">
                            No users found
                        </p>
                    ) : (
                        filteredCreators.map((creator) => {
                            const isSelected = selectedIds.includes(creator.id);
                            const avatarSrc = getAvatarSrc(creator.avatarUrl);

                            return (
                                <button
                                    key={creator.id}
                                    type="button"
                                    onClick={() => onToggle(creator.id)}
                                    className={cn(
                                        "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors",
                                        isSelected
                                            ? "bg-primary/10 text-foreground"
                                            : "hover:bg-muted/60"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "flex size-4 shrink-0 items-center justify-center rounded border",
                                            isSelected
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border bg-background"
                                        )}
                                    >
                                        {isSelected ? (
                                            <Check className="size-2.5" />
                                        ) : null}
                                    </span>

                                    <Avatar className="size-7 shrink-0">
                                        {avatarSrc ? (
                                            <AvatarImage
                                                src={avatarSrc}
                                                alt={creator.name}
                                            />
                                        ) : null}
                                        <AvatarFallback className="text-[10px] font-semibold">
                                            {getInitials(creator.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-xs font-medium">
                                            {creator.name}
                                        </span>
                                        <span className="block truncate text-[10px] text-muted-foreground">
                                            {creator.email}
                                        </span>
                                    </span>

                                    <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                                        {creator.organizationCount}
                                    </span>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </FilterField>
    );
}

function CompactDateInput({
    id,
    placeholder,
    value,
    onChange,
}: {
    id: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <FieldInput
            id={id}
            type="date"
            placeholder={placeholder}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-9 text-xs"
        />
    );
}

function CompactNumberInput({
    id,
    placeholder,
    value,
    onChange,
}: {
    id: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <FieldInput
            id={id}
            type="number"
            min={0}
            placeholder={placeholder}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-9 text-xs"
        />
    );
}
