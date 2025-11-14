/**
 * @file data-table-filters-example.tsx
 * @description Example usage of the DataTableFilters component
 * This file demonstrates how to use the generic DataTableFilters component
 * to create consistent filter UIs across different admin pages.
 */

import { DataTableFilters } from "./data-table-filters";

/**
 * Example 1: Simple filters with search and select
 */
export function SimpleFiltersExample() {
  // These would typically come from useQueryStates or useState
  const filters = { search: "", status: "all" };
  const setFilters = (newFilters: any) => console.log(newFilters);

  return (
    <DataTableFilters
      filters={[
        {
          type: "search",
          key: "search",
          placeholder: "Search by name, email, or organization",
          value: filters.search,
          onChange: (value) => setFilters({ search: value, page: 1 }),
        },
        {
          type: "select",
          key: "status",
          placeholder: "Status",
          options: [
            { label: "All statuses", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ],
          value: filters.status,
          onChange: (value) => setFilters({ status: value === "all" ? undefined : value, page: 1 }),
          className: "w-[160px]",
        },
      ]}
      onCreateClick={() => console.log("Create clicked")}
      createButtonLabel="Create learner"
    />
  );
}

/**
 * Example 2: Multiple select filters (for complex filtering)
 */
export function MultipleSelectFiltersExample() {
  const filters = { courseId: "all", learnerId: "all", status: "all", limit: 10 };
  const setFilters = (newFilters: any) => console.log(newFilters);

  const courseOptions = [
    { label: "Course A", value: "1" },
    { label: "Course B", value: "2" },
  ];

  const learnerOptions = [
    { label: "John Doe", value: "1" },
    { label: "Jane Smith", value: "2" },
  ];

  return (
    <DataTableFilters
      filters={[
        {
          type: "select",
          key: "courseId",
          placeholder: "Course",
          options: [{ label: "All courses", value: "all" }, ...courseOptions],
          value: filters.courseId,
          onChange: (value) => setFilters({ courseId: value === "all" ? undefined : value, page: 1 }),
          className: "w-[220px]",
        },
        {
          type: "select",
          key: "learnerId",
          placeholder: "Learner",
          options: [{ label: "All learners", value: "all" }, ...learnerOptions],
          value: filters.learnerId,
          onChange: (value) => setFilters({ learnerId: value === "all" ? undefined : value, page: 1 }),
          className: "w-[220px]",
        },
        {
          type: "select",
          key: "status",
          placeholder: "Status",
          options: [
            { label: "All statuses", value: "all" },
            { label: "Enrolled", value: "enrolled" },
            { label: "Completed", value: "completed" },
          ],
          value: filters.status,
          onChange: (value) => setFilters({ status: value === "all" ? undefined : value, page: 1 }),
          className: "w-[160px]",
        },
        {
          type: "select",
          key: "limit",
          placeholder: "Rows",
          options: [
            { label: "10 / page", value: "10" },
            { label: "20 / page", value: "20" },
            { label: "50 / page", value: "50" },
          ],
          value: String(filters.limit),
          onChange: (value) => setFilters({ limit: Number(value), page: 1 }),
          className: "w-[120px]",
        },
      ]}
      onCreateClick={() => console.log("Register clicked")}
      createButtonLabel="Register learner"
    />
  );
}

/**
 * Example 3: Custom filter components
 */
export function CustomFilterExample() {
  const filters = { search: "", dateRange: null };
  const setFilters = (newFilters: any) => console.log(newFilters);

  return (
    <DataTableFilters
      filters={[
        {
          type: "search",
          key: "search",
          placeholder: "Search...",
          value: filters.search,
          onChange: (value) => setFilters({ search: value }),
        },
        {
          type: "custom",
          key: "dateRange",
          component: (
            <div className="flex items-center gap-2">
              {/* Custom date range picker would go here */}
              <button className="rounded border px-3 py-2 text-sm">Select date range</button>
            </div>
          ),
        },
      ]}
      onCreateClick={() => console.log("Create clicked")}
      createButtonLabel="Create"
    />
  );
}

/**
 * Example 4: Filters without create button
 */
export function FiltersWithoutCreateButtonExample() {
  const filters = { search: "" };
  const setFilters = (newFilters: any) => console.log(newFilters);

  return (
    <DataTableFilters
      filters={[
        {
          type: "search",
          key: "search",
          placeholder: "Search...",
          value: filters.search,
          onChange: (value) => setFilters({ search: value }),
        },
      ]}
      showCreateButton={false}
    />
  );
}
