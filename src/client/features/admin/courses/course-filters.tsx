"use client";

import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { Row } from "@/client/components/layout/row";

const PUBLISH_FILTERS = [
  { label: "All courses", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
] as const;

const LIMIT_OPTIONS = [10, 20, 50] as const;

type CourseFiltersProps = {
  search: string;
  published: boolean | undefined | null;
  limit: number;
  onSearchChange: (search: string) => void;
  onPublishedChange: (published: boolean | undefined | null) => void;
  onLimitChange: (limit: number) => void;
  onCreateClick: () => void;
};

export function CourseFilters({
  search,
  published,
  limit,
  onSearchChange,
  onPublishedChange,
  onLimitChange,
  onCreateClick,
}: CourseFiltersProps) {
  const publishFilterValue =
    published === true ? "published" : published === false ? "draft" : "all";

  return (
    <Row gap="between" className="flex-wrap gap-4">
      <Row className="flex-1 flex-wrap gap-3 min-w-0">
        <Input
          className="max-w-xs"
          value={search}
          placeholder="Search by code, title, or description"
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <Select
          value={publishFilterValue}
          onValueChange={(value) => {
            if (value === "all") {
              onPublishedChange(undefined);
              return;
            }
            onPublishedChange(value === "published");
          }}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Publication" />
          </SelectTrigger>
          <SelectContent>
            {PUBLISH_FILTERS.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={String(limit)} onValueChange={(value) => onLimitChange(Number(value))}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Rows" />
          </SelectTrigger>
          <SelectContent>
            {LIMIT_OPTIONS.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option} / page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Row>
      <Button onClick={onCreateClick}>Create course</Button>
    </Row>
  );
}
