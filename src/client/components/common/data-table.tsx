"use client";

import * as React from "react";
import { Table as TableInstance, flexRender } from "@tanstack/react-table";
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { cn } from "@/client/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import { Button, buttonVariants } from "@/client/components/ui/button";
import { Stack } from "../layout/stack";
import { Typography } from "./typography";
import { VariantProps } from "class-variance-authority";

export interface DataTableProps<TData> {
  /** TanStack Table instance created with `useReactTable` */
  table: TableInstance<TData>;

  // UI customization
  /** Optional title displayed above the table */
  title?: string;
  /** Whether to show the table header row. @default true */
  showHeader?: boolean;
  /** Enable hover effect on table rows. @default true */
  enableRowHover?: boolean;
  /** CSS class for the container wrapper */
  className?: string;
  /** CSS class for the table element */
  tableClassName?: string;
  /** CSS class for table header cells */
  headerClassName?: string;
  /** CSS class for table rows. Can be a function that returns a class based on row data */
  rowClassName?: string | ((row: TData) => string);
  /** CSS class for table cells */
  cellClassName?: string;

  // "View More" functionality
  viewMore?: {
    text: string;
    onClick: () => void;
    style?: "default" | "outline";
  };

  // Loading state
  /** Show loading skeleton instead of data. @default false */
  isLoading?: boolean;
  /** Number of skeleton rows to display when loading. @default 5 */
  loadingRows?: number;

  // Empty state
  /** Message to display when table has no data. @default "No results found." */
  emptyStateText?: string;
  /** Custom component to display when table is empty */
  emptyStateComponent?: React.ReactNode;

  // Pagination UI
  /** Show pagination controls below the table. @default false */
  showPagination?: boolean;
  /** Total number of items (for accurate pagination text) */
  dataCount?: number;
}

/**
 * @author Edward Ward @Phyo-Alpha
 *
 * @description
 * A highly customizable data table component built with Tanstack Table + ShadCN.
 * The idea behind this component is so that you just passed the table instance and the component will handle the rest.
 * Split into smaller components for better readability and maintainability.
 *
 * Handles rendering, loading states, empty states, and pagination UI.
 * The parent component should create the table instance and manage state (sorting, filtering, pagination) using useReactTable.
 *
 *
 * @example
 * ```tsx
 * const table = useReactTable({
 *   data: myData,
 *   columns: myColumns,
 *   getCoreRowModel: getCoreRowModel(),
 *   getSortedRowModel: getSortedRowModel(),
 * });
 *
 * return (
 *   <DataTable
 *     table={table}
 *     title="My Table"
 *     showViewMore={true}
 *     onViewMore={handleViewMore}
 *   />
 * );
 * ```
 */
function DataTable<TData>({
  table,

  // UI customization
  title,
  showHeader = true,
  enableRowHover = true,
  className,
  tableClassName,
  headerClassName,
  rowClassName,
  cellClassName,

  // View More
  viewMore,

  // Loading
  isLoading = false,
  loadingRows = 5,

  // Empty state
  emptyStateText = "No results found.",
  emptyStateComponent,

  // Pagination
  showPagination = false,
  dataCount,
}: DataTableProps<TData>) {
  const data = table.getRowModel().rows;

  if (isLoading) {
    return (
      <DataTableLoadingSkeleton
        table={table}
        title={title}
        showHeader={showHeader}
        className={className}
        tableClassName={tableClassName}
        headerClassName={headerClassName}
        loadingRows={loadingRows}
      />
    );
  }

  if (!isLoading && data.length === 0) {
    return (
      <DataTableEmptyState
        table={table}
        title={title}
        className={className}
        emptyStateComponent={emptyStateComponent}
        emptyStateText={emptyStateText}
      />
    );
  }

  const viewMoreButtonVariant: {
    variant: VariantProps<typeof buttonVariants>["variant"];
    size: VariantProps<typeof buttonVariants>["size"];
    rounded: VariantProps<typeof buttonVariants>["rounded"];
  } =
    viewMore?.style === "outline"
      ? {
          variant: "outline",
          size: "xl",
          rounded: "sm",
        }
      : {
          variant: "default",
          size: "xl",
          rounded: "sm",
        };

  return (
    <Stack className={cn("w-full space-y-4", className)}>
      {title && <Typography.H3>{title}</Typography.H3>}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <Table className={cn(tableClassName, "text-text-on-background-container")}>
          {showHeader && <DataTableHeader table={table} headerClassName={headerClassName} />}
          <DataTableBody
            table={table}
            rowClassName={rowClassName}
            cellClassName={cellClassName}
            enableRowHover={enableRowHover}
          />
        </Table>
      </div>
      {showPagination && <DataTablePagination table={table} dataCount={dataCount} />}
      {viewMore && (
        <div className="flex justify-end">
          <Button {...viewMoreButtonVariant} onClick={viewMore.onClick}>
            {viewMore.text}
          </Button>
        </div>
      )}
    </Stack>
  );
}
DataTable.displayName = "DataTable";

function DataTableLoadingSkeleton<TData>({
  table,
  title,
  showHeader = true,
  className,
  tableClassName,
  headerClassName,
  loadingRows = 5,
}: DataTableProps<TData>) {
  return (
    <div className={cn("w-full space-y-4", className)}>
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      <div className="rounded-lg border">
        <Table className={tableClassName}>
          {showHeader && (
            <TableHeader>
              <TableRow>
                {table.getAllColumns().map((column, index) => (
                  <TableHead key={index} className={cn("px-6 py-5", headerClassName)}>
                    <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {Array.from({ length: loadingRows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {table.getAllColumns().map((_, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
DataTableLoadingSkeleton.displayName = "DataTableLoadingSkeleton";

function DataTableEmptyState<TData>({
  title,
  className,
  emptyStateComponent,
  emptyStateText,
}: DataTableProps<TData>) {
  return (
    <div className={cn("w-full space-y-4", className)}>
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border">
        {emptyStateComponent || <p className="text-muted-foreground text-sm">{emptyStateText}</p>}
      </div>
    </div>
  );
}
DataTableEmptyState.displayName = "DataTableEmptyState";

function DataTableHeader<TData>({ table, headerClassName }: DataTableProps<TData>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className={cn(headerClassName, "border-b bg-gray-50/50")}>
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            const isSorted = header.column.getIsSorted();

            return (
              <TableHead
                key={header.id}
                className={cn(
                  "px-4 py-3 text-xs font-medium text-gray-600",
                  canSort && "cursor-pointer select-none",
                  headerClassName,
                )}
                onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
              >
                <div className="flex items-center gap-2">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}

                  {canSort && (
                    <span className="ml-auto">
                      {isSorted === "asc" && <ChevronUp className="size-4" />}
                      {isSorted === "desc" && <ChevronDown className="size-4" />}
                      {!isSorted && <ChevronsUpDown className="size-4" />}
                    </span>
                  )}
                </div>
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
DataTableHeader.displayName = "DataTableHeader";

function DataTableBody<TData>({
  table,
  rowClassName,
  cellClassName,
  enableRowHover,
}: DataTableProps<TData>) {
  const data = table.getRowModel().rows;

  return (
    <TableBody>
      {data.map((row) => {
        const rowClassNameValue =
          typeof rowClassName === "function" ? rowClassName(row.original) : rowClassName;

        return (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() ? "selected" : undefined}
            className={cn(enableRowHover && "hover:bg-muted/50", rowClassNameValue)}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                className={cn(cellClassName, "px-4 py-3 text-sm")}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </TableBody>
  );
}
DataTableBody.displayName = "DataTableBody";

function DataTablePagination<TData>({ table, dataCount }: DataTableProps<TData>) {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;
  const totalCount = table.getFilteredRowModel().rows.length;

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-gray-600">
        {selectedCount > 0 ? (
          <span>
            {selectedCount} of {totalCount} row(s) selected.
          </span>
        ) : dataCount !== undefined ? (
          <>
            Showing{" "}
            {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              dataCount,
            )}{" "}
            of {dataCount} results
          </>
        ) : (
          <>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
DataTablePagination.displayName = "DataTablePagination";

export default DataTable;
