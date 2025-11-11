"use client";

import { useMemo, useState } from "react";
import { parseAsBoolean, parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/client/components/ui/alert-dialog";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/client/components/ui/dialog";
import { Input } from "@/client/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnDef,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import { toast } from "sonner";

import {
  courseQueries,
  type CourseCreateInput,
  type CourseEntity,
  type CourseListParams,
  type CourseUpdateInput,
} from "@/client/services/courses";
import { eden } from "@/client/lib/eden";
import { CourseForm, type CourseFormValues } from "@/client/features/admin/courses";
import DataTable from "@/client/components/common/data-table";
import { Page } from "@/client/components/layout/page";
import { Typography } from "@/client/components/common/typography";
import { Stack } from "@/client/components/layout/stack";
import { Row } from "@/client/components/layout/row";

const PUBLISH_FILTERS = [
  { label: "All courses", value: "all" },
  { label: "Published", value: "published" },
  { label: "Draft", value: "draft" },
] as const;

const LIMIT_OPTIONS = [10, 20, 50] as const;

export default function CoursesPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseEntity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CourseEntity | null>(null);

  const [filters, setFilters] = useQueryStates(
    {
      search: parseAsString
        .withDefault("")
        .withOptions({ history: "replace", throttleMs: 300, clearOnDefault: true }),
      published: parseAsBoolean.withOptions({ history: "replace" }),
      page: parseAsInteger.withDefault(1).withOptions({ history: "replace" }),
      limit: parseAsInteger.withDefault(10).withOptions({ history: "replace" }),
    },
    { shallow: false },
  );

  const normalizedFilters = useMemo<CourseListParams>(() => {
    const payload: CourseListParams = {
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
      sort: "createdAt",
      order: "desc",
    };

    const search = filters.search?.trim();
    if (search) {
      payload.search = search;
    }

    if (typeof filters.published === "boolean") {
      payload.published = filters.published;
    }

    return payload;
  }, [filters]);

  const coursesQuery = useQuery(courseQueries.list(normalizedFilters));

  const createCourseMutation = useMutation(courseQueries.create());

  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CourseUpdateInput }) => {
      return eden.admin.courses({ id }).patch(data);
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (id: string) => {
      return eden.admin.courses({ id }).delete();
    },
  });

  const courses = coursesQuery.data?.data ?? [];
  const pagination = coursesQuery.data?.pagination;
  const totalCount = pagination?.totalItems ?? 0;

  const columns = useMemo<ColumnDef<CourseEntity>[]>(
    () => [
      {
        accessorKey: "course",
        header: "Course",
        cell: ({ row }) => {
          const course = row.original;
          return (
            <div className="flex flex-col">
              <span className="font-medium">{course.title}</span>
              <span className="text-xs text-muted-foreground">{course.code}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "schedule",
        header: "Schedule",
        cell: ({ row }) => {
          const course = row.original;
          const startDate = course.startDate ? dayjs(course.startDate).format("DD MMM YYYY") : null;
          const endDate = course.endDate ? dayjs(course.endDate).format("DD MMM YYYY") : null;

          return startDate ? (
            <span>
              {startDate}
              {endDate ? ` – ${endDate}` : ""}
            </span>
          ) : (
            <span className="text-muted-foreground text-xs">Schedule pending</span>
          );
        },
      },
      {
        accessorKey: "durationHours",
        header: "Duration",
        cell: ({ row }) => `${row.original.durationHours} hrs`,
      },
      {
        accessorKey: "capacity",
        header: "Capacity",
        cell: ({ row }) => row.original.capacity ?? "—",
      },
      {
        accessorKey: "isPublished",
        header: "Status",
        cell: ({ row }) => {
          const isPublished = row.original.isPublished;
          return (
            <Badge variant={isPublished ? "default" : "secondary"}>
              {isPublished ? "Published" : "Draft"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const course = row.original;
          return (
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingCourse(course)}>
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleteTarget(course)}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: courses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: pagination?.totalPages ?? 1,
    state: {
      pagination: {
        pageIndex: (normalizedFilters.page ?? 1) - 1,
        pageSize: normalizedFilters.limit ?? 10,
      },
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({
              pageIndex: (normalizedFilters.page ?? 1) - 1,
              pageSize: normalizedFilters.limit ?? 10,
            })
          : updater;
      setFilters({
        page: newPagination.pageIndex + 1,
        limit: newPagination.pageSize,
      });
    },
  });

  const handleCreateCourse = async (values: CourseFormValues) => {
    await createCourseMutation
      .mutateAsync(values as CourseCreateInput, {
        onSuccess: () => {
          toast.success("Course created successfully");
          queryClient.invalidateQueries({ queryKey: courseQueries.lists() });
          setFilters({ page: 1 });
          setIsCreateOpen(false);
        },
      })
      .catch((error) => {
        toast.error(error.message ?? "Failed to create course");
      });
  };

  const handleUpdateCourse = async (values: CourseFormValues) => {
    if (!editingCourse) return;
    await updateCourseMutation
      .mutateAsync(
        {
          id: editingCourse.id,
          data: values as CourseUpdateInput,
        },
        {
          onSuccess: () => {
            toast.success("Course updated");
            queryClient.invalidateQueries({ queryKey: courseQueries.lists() });
            queryClient.invalidateQueries({ queryKey: courseQueries.details() });
            setEditingCourse(null);
          },
        },
      )
      .catch((error) => {
        toast.error(error.message ?? "Failed to update course");
      });
  };

  const handleDeleteCourse = async () => {
    if (!deleteTarget) return;
    await deleteCourseMutation
      .mutateAsync(deleteTarget.id, {
        onSuccess: () => {
          toast.success("Course deleted");
          queryClient.invalidateQueries({ queryKey: courseQueries.lists() });
          setDeleteTarget(null);
        },
      })
      .catch((error) => {
        toast.error(error.message ?? "Failed to delete course");
      });
  };

  const publishFilterValue =
    filters.published === true ? "published" : filters.published === false ? "draft" : "all";

  const emptyStateComponent = (
    <div className="flex flex-col items-center gap-4 py-8">
      <p className="text-muted-foreground text-sm">No courses yet</p>
      <p className="text-muted-foreground text-sm">
        Create a course to begin scheduling trainee programmes.
      </p>
      <Button onClick={() => setIsCreateOpen(true)}>Create course</Button>
    </div>
  );

  return (
    <Page className="mx-auto w-full max-w-7xl p-6 lg:p-8">
      <Stack>
        <div className="flex flex-col gap-2">
          <Typography.H1>Courses</Typography.H1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Publish course catalogues, manage schedules, and keep programme capacity up to date.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border bg-background p-4 shadow-sm">
          <Row gap="between" className="flex-wrap">
            <Row className="flex-1 flex-wrap gap-3">
              <Input
                className="max-w-xs"
                value={filters.search ?? ""}
                placeholder="Search by code, title, or description"
                onChange={(event) =>
                  setFilters({
                    search: event.target.value ? event.target.value : undefined,
                    page: 1,
                  })
                }
              />
              <Select
                value={publishFilterValue}
                onValueChange={(value) => {
                  if (value === "all") {
                    setFilters({ published: undefined, page: 1 });
                    return;
                  }
                  setFilters({
                    published: value === "published",
                    page: 1,
                  });
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
              <Select
                value={String(filters.limit ?? 10)}
                onValueChange={(value) => {
                  setFilters({
                    limit: Number(value),
                    page: 1,
                  });
                }}
              >
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
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button>Create course</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add course</DialogTitle>
                  <DialogDescription>
                    Define the course schedule and capacity before opening enrolments to learners.
                  </DialogDescription>
                </DialogHeader>
                <CourseForm
                  onSubmit={handleCreateCourse}
                  onCancel={() => setIsCreateOpen(false)}
                  submitLabel={createCourseMutation.isPending ? "Creating…" : "Create course"}
                />
              </DialogContent>
            </Dialog>
          </Row>

          <DataTable
            table={table}
            isLoading={coursesQuery.isLoading}
            emptyStateComponent={emptyStateComponent}
            emptyStateText="No courses found."
            showPagination={true}
            dataCount={totalCount}
          />
        </div>
      </Stack>

      <Dialog
        open={Boolean(editingCourse)}
        onOpenChange={(open) => !open && setEditingCourse(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit course</DialogTitle>
            <DialogDescription>
              Adjust scheduling, capacity, or publication status.
            </DialogDescription>
          </DialogHeader>
          {editingCourse && (
            <CourseForm
              initialValues={{
                code: editingCourse.code,
                title: editingCourse.title,
                description: editingCourse.description ?? "",
                durationHours: editingCourse.durationHours,
                startDate: editingCourse.startDate ? new Date(editingCourse.startDate) : null,
                endDate: editingCourse.endDate ? new Date(editingCourse.endDate) : null,
                capacity: editingCourse.capacity ?? undefined,
                isPublished: editingCourse.isPublished,
              }}
              onSubmit={handleUpdateCourse}
              onCancel={() => setEditingCourse(null)}
              submitLabel={updateCourseMutation.isPending ? "Updating…" : "Update course"}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete course</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Ensure all learners are withdrawn before deleting a
              course.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteCourseMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDeleteCourse}
              disabled={deleteCourseMutation.isPending}
            >
              {deleteCourseMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}
