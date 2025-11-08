"use client";

import { useMemo, useState } from "react";
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from "nuqs";
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
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/client/components/ui/empty";
import { Input } from "@/client/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/client/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { Spinner } from "@/client/components/ui/spinner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast } from "sonner";

import {
  courseQueries,
  type CourseCreateInput,
  type CourseEntity,
  type CourseListParams,
  type CourseUpdateInput,
} from "@/client/services/courses";
import { CourseForm, type CourseFormValues } from "@/client/features/admin/courses";

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
      const mutation = courseQueries.update(id);
      return mutation.mutationFn(data);
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id: string) => courseQueries.remove().mutationFn(id),
  });

  const courses = coursesQuery.data?.data ?? [];
  const pagination = coursesQuery.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? normalizedFilters.page ?? 1;

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

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const publishFilterValue =
    filters.published === true ? "published" : filters.published === false ? "draft" : "all";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Courses</h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Publish course catalogues, manage schedules, and keep programme capacity up to date.
        </p>
      </header>

      <div className="flex flex-col gap-4 rounded-lg border bg-background p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
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
          </div>
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
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {coursesQuery.isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Spinner className="size-6" />
                      <p className="text-sm text-muted-foreground">Loading courses…</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {coursesQuery.isError && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12">
                    <Empty className="border-0">
                      <EmptyHeader>
                        <EmptyTitle>Unable to load courses</EmptyTitle>
                        <EmptyDescription className="max-w-sm">
                          {(coursesQuery.error as Error).message ?? "Please try again shortly."}
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}

              {!coursesQuery.isLoading && !coursesQuery.isError && courses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12">
                    <Empty className="border-0">
                      <EmptyHeader>
                        <EmptyTitle>No courses yet</EmptyTitle>
                        <EmptyDescription>
                          Create a course to begin scheduling trainee programmes.
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button onClick={() => setIsCreateOpen(true)}>Create course</Button>
                      </EmptyContent>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}

              {courses.map((course) => {
                const startDate = course.startDate ? dayjs(course.startDate).format("DD MMM YYYY") : null;
                const endDate = course.endDate ? dayjs(course.endDate).format("DD MMM YYYY") : null;

                return (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{course.title}</span>
                        <span className="text-xs text-muted-foreground">{course.code}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {startDate ? (
                        <span>
                          {startDate}
                          {endDate ? ` – ${endDate}` : ""}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">Schedule pending</span>
                      )}
                    </TableCell>
                    <TableCell>{course.durationHours} hrs</TableCell>
                    <TableCell>{course.capacity ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={course.isPublished ? "default" : "secondary"}>
                        {course.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingCourse(course)}
                        >
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  aria-disabled={currentPage <= 1}
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                />
              </PaginationItem>
              {(() => {
                const windowSize = 2;
                const start = Math.max(1, currentPage - windowSize);
                const end = Math.min(totalPages, currentPage + windowSize);
                const items: Array<number | "ellipsis-start" | "ellipsis-end"> = [];

                if (start > 1) {
                  items.push(1);
                  if (start > 2) items.push("ellipsis-start");
                }

                for (let page = start; page <= end; page += 1) {
                  items.push(page);
                }

                if (end < totalPages) {
                  if (end < totalPages - 1) items.push("ellipsis-end");
                  items.push(totalPages);
                }

                return items.map((item, index) => {
                  if (item === "ellipsis-start" || item === "ellipsis-end") {
                    return (
                      <PaginationItem key={`${item}-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  const pageNumber = item;
                  const isActive = pageNumber === currentPage;
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={isActive}
                        onClick={(event) => {
                          event.preventDefault();
                          handlePageChange(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                });
              })()}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  aria-disabled={currentPage >= totalPages}
                  onClick={(event) => {
                    event.preventDefault();
                    if (currentPage < totalPages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <Dialog open={Boolean(editingCourse)} onOpenChange={(open) => !open && setEditingCourse(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit course</DialogTitle>
            <DialogDescription>Adjust scheduling, capacity, or publication status.</DialogDescription>
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

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete course</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Ensure all learners are withdrawn before deleting a course.
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
    </div>
  );
}
