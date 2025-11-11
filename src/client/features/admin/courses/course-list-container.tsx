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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/client/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  courseQueries,
  type CourseCreateInput,
  type CourseEntity,
  type CourseListParams,
  type CourseUpdateInput,
} from "@/client/services/courses";
import { eden } from "@/client/lib/eden";
import { CourseForm, type CourseFormValues } from "./course-form";
import { CourseFilters } from "./course-filters";
import { CourseList } from "./course-list";
import { Page } from "@/client/components/layout/page";
import { Typography } from "@/client/components/common/typography";
import { Stack } from "@/client/components/layout/stack";
import { Button } from "@/client/components/ui/button";

export function CourseListContainer() {
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
      limit: parseAsInteger.withDefault(12).withOptions({ history: "replace" }),
    },
    { shallow: false },
  );

  const normalizedFilters = useMemo<CourseListParams>(() => {
    const payload: CourseListParams = {
      page: filters.page ?? 1,
      limit: filters.limit ?? 12,
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

  const handleSearchChange = (search: string) => {
    setFilters({
      search: search || undefined,
      page: 1,
    });
  };

  const handlePublishedChange = (published: boolean | undefined | null) => {
    setFilters({
      published: published ?? undefined,
      page: 1,
    });
  };

  const handleLimitChange = (limit: number) => {
    setFilters({
      limit,
      page: 1,
    });
  };

  return (
    <Page className="mx-auto w-full max-w-7xl p-6 lg:p-8">
      <Stack>
        <div className="flex flex-col gap-2">
          <Typography.H1>Courses</Typography.H1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Publish course catalogues, manage schedules, and keep programme capacity up to date.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <CourseFilters
            search={filters.search ?? ""}
            published={filters.published}
            limit={filters.limit ?? 12}
            onSearchChange={handleSearchChange}
            onPublishedChange={handlePublishedChange}
            onLimitChange={handleLimitChange}
            onCreateClick={() => setIsCreateOpen(true)}
          />

          <CourseList
            courses={courses}
            isLoading={coursesQuery.isLoading}
            onEdit={setEditingCourse}
            onDelete={setDeleteTarget}
            onCreateClick={() => setIsCreateOpen(true)}
          />

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ page: (filters.page ?? 1) - 1 })}
                disabled={filters.page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {filters.page ?? 1} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ page: (filters.page ?? 1) + 1 })}
                disabled={(filters.page ?? 1) >= pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </Stack>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger asChild>
          <span className="hidden" />
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
