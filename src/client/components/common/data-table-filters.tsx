"use client";

import * as React from "react";
import { Input } from "@/client/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { Button } from "@/client/components/ui/button";
import { Row } from "@/client/components/layout/row";
import { cn } from "@/client/lib/utils";

export interface FilterConfig {
  type: "search" | "select" | "custom";
  key: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string | undefined) => void;
  className?: string;
  component?: React.ReactNode;
}

export interface DataTableFiltersProps {
  filters: FilterConfig[];
  onCreateClick?: () => void;
  createButtonLabel?: string;
  className?: string;
  showCreateButton?: boolean;
}

/**
 * @description
 * A generic, reusable filter component for data tables.
 * Supports search inputs, select dropdowns, and custom filter components.
 * Designed to reduce code duplication across admin pages.
 *
 * @example
 * ```tsx
 * <DataTableFilters
 *   filters={[
 *     {
 *       type: "search",
 *       key: "search",
 *       placeholder: "Search by name...",
 *       value: filters.search,
 *       onChange: (value) => setFilters({ search: value, page: 1 }),
 *     },
 *     {
 *       type: "select",
 *       key: "status",
 *       placeholder: "Status",
 *       options: [
 *         { label: "All", value: "all" },
 *         { label: "Active", value: "active" },
 *       ],
 *       value: filters.status,
 *       onChange: (value) => setFilters({ status: value === "all" ? undefined : value }),
 *     },
 *   ]}
 *   onCreateClick={() => setIsCreateOpen(true)}
 *   createButtonLabel="Create item"
 * />
 * ```
 */
export function DataTableFilters({
  filters,
  onCreateClick,
  createButtonLabel = "Create",
  className,
  showCreateButton = true,
}: DataTableFiltersProps) {
  return (
    <Row gap="between" className={cn("flex-wrap", className)}>
      <Row className="flex-1 flex-wrap gap-3">
        {filters.map((filter) => {
          if (filter.type === "search") {
            return (
              <Input
                key={filter.key}
                className={cn("max-w-xs", filter.className)}
                value={filter.value ?? ""}
                placeholder={filter.placeholder ?? "Search..."}
                onChange={(e) => filter.onChange?.(e.target.value || undefined)}
              />
            );
          }

          if (filter.type === "select") {
            return (
              <Select
                key={filter.key}
                value={filter.value ?? filter.defaultValue ?? "all"}
                onValueChange={(value) => filter.onChange?.(value)}
              >
                <SelectTrigger className={cn("w-[160px]", filter.className)}>
                  <SelectValue placeholder={filter.placeholder ?? "Select..."} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            );
          }

          if (filter.type === "custom" && filter.component) {
            return <React.Fragment key={filter.key}>{filter.component}</React.Fragment>;
          }

          return null;
        })}
      </Row>
      {showCreateButton && onCreateClick && (
        <Button onClick={onCreateClick}>{createButtonLabel}</Button>
      )}
    </Row>
  );
}
