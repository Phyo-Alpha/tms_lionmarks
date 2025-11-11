"use client";

import { useMemo, useState } from "react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
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

import { learnerQueries } from "@/client/services/learners";
import { courseQueries } from "@/client/services/courses";
import {
  registrationQueries,
  type RegistrationCreateInput,
  type RegistrationEntity,
  type RegistrationListParams,
  type RegistrationUpdateInput,
} from "@/client/services/registrations";
import {
  RegistrationForm,
  type RegistrationFormValues,
} from "@/client/features/admin/registrations";
import { eden } from "@/client/lib/eden";
import DataTable from "@/client/components/common/data-table";
import { Page } from "@/client/components/layout/page";
import { Typography } from "@/client/components/common/typography";
import { Stack } from "@/client/components/layout/stack";
import { Row } from "@/client/components/layout/row";

const LIMIT_OPTIONS = [10, 20, 50] as const;
const STATUS_OPTIONS = [
  { label: "All statuses", value: "all" },
  { label: "Enrolled", value: "enrolled" },
  { label: "In progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Withdrawn", value: "withdrawn" },
] as const;

const statusVariant: Record<RegistrationEntity["status"], "default" | "secondary" | "destructive"> =
  {
    enrolled: "default",
    in_progress: "secondary",
    completed: "default",
    withdrawn: "destructive",
  };

export default function RegistrationsPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRegistration, setEditingRegistration] = useState<RegistrationEntity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RegistrationEntity | null>(null);

  const [filters, setFilters] = useQueryStates(
    {
      courseId: parseAsString.withOptions({ history: "replace", clearOnDefault: true }),
      learnerId: parseAsString.withOptions({ history: "replace", clearOnDefault: true }),
      status: parseAsString.withOptions({ history: "replace", clearOnDefault: true }),
      page: parseAsInteger.withDefault(1).withOptions({ history: "replace" }),
      limit: parseAsInteger.withDefault(10).withOptions({ history: "replace" }),
    },
    { shallow: false },
  );

  const normalizedFilters = useMemo<RegistrationListParams>(() => {
    const payload: RegistrationListParams = {
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
      order: "desc",
    };

    if (filters.courseId) payload.courseId = filters.courseId;
    if (filters.learnerId) payload.learnerId = filters.learnerId;
    if (
      filters.status === "enrolled" ||
      filters.status === "in_progress" ||
      filters.status === "completed" ||
      filters.status === "withdrawn"
    ) {
      payload.status = filters.status;
    }

    return payload;
  }, [filters]);

  const registrationsQuery = useQuery(registrationQueries.list(normalizedFilters));

  const learnersOptionsQuery = useQuery(
    learnerQueries.list({ page: 1, limit: 100, sort: "firstName", order: "asc" }),
  );
  const coursesOptionsQuery = useQuery(
    courseQueries.list({ page: 1, limit: 100, sort: "title", order: "asc" }),
  );

  const createRegistrationMutation = useMutation(registrationQueries.create());

  const updateRegistrationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: RegistrationUpdateInput }) =>
      eden.admin.registrations({ id }).patch(data),
  });

  const deleteRegistrationMutation = useMutation({
    mutationFn: (id: string) => eden.admin.registrations({ id }).delete(),
  });

  const registrations = registrationsQuery.data?.data ?? [];
  const pagination = registrationsQuery.data?.pagination;
  const totalCount = pagination?.totalItems ?? 0;

  const courseOptions =
    coursesOptionsQuery.data?.data.map((course) => ({
      label: `${course.code} — ${course.title}`,
      value: course.id,
    })) ?? [];

  const courseMeta = useMemo(
    () =>
      Object.fromEntries(
        (coursesOptionsQuery.data?.data ?? []).map((course) => [
          course.id,
          {
            capacity: course.capacity ?? null,
            startDate: course.startDate ?? null,
            endDate: course.endDate ?? null,
            isPublished: course.isPublished ?? false,
          },
        ]),
      ),
    [coursesOptionsQuery.data],
  );

  const learnerOptions =
    learnersOptionsQuery.data?.data.map((learner) => ({
      label: `${learner.firstName} ${learner.lastName}`,
      value: learner.id,
    })) ?? [];

  const columns = useMemo<ColumnDef<RegistrationEntity>[]>(
    () => [
      {
        accessorKey: "learner",
        header: "Learner",
        cell: ({ row }) => {
          const registration = row.original;
          return (
            <div className="flex flex-col">
              <span className="font-medium">
                {registration.learner
                  ? `${registration.learner.firstName} ${registration.learner.lastName}`
                  : "Learner removed"}
              </span>
              <span className="text-xs text-muted-foreground">
                {registration.learner?.email ?? "—"}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "course",
        header: "Course",
        cell: ({ row }) => {
          const registration = row.original;
          return (
            <div className="flex flex-col">
              <span className="font-medium">{registration.course?.title ?? "Course removed"}</span>
              <span className="text-xs text-muted-foreground">
                {registration.course?.code ?? "—"}
              </span>
              {typeof registration.course?.capacity === "number" && (
                <span className="text-[11px] text-muted-foreground">
                  Capacity {registration.course.capacity}
                </span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          return <Badge variant={statusVariant[status]}>{status.replace("_", " ")}</Badge>;
        },
      },
      {
        accessorKey: "registeredAt",
        header: "Registered",
        cell: ({ row }) => {
          const date = row.original.registeredAt;
          return date ? dayjs(date).format("DD MMM YYYY") : "—";
        },
      },
      {
        accessorKey: "completedAt",
        header: "Completed",
        cell: ({ row }) => {
          const date = row.original.completedAt;
          return date ? dayjs(date).format("DD MMM YYYY") : "—";
        },
      },
      {
        accessorKey: "score",
        header: "Score",
        cell: ({ row }) => row.original.score ?? "—",
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const registration = row.original;
          return (
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingRegistration(registration)}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => setDeleteTarget(registration)}
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
    data: registrations,
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

  const handleCreateRegistration = async (values: RegistrationFormValues) => {
    await createRegistrationMutation
      .mutateAsync(values as RegistrationCreateInput, {
        onSuccess: () => {
          toast.success("Registration created");
          queryClient.invalidateQueries({ queryKey: registrationQueries.lists() });
          setFilters({ page: 1 });
          setIsCreateOpen(false);
        },
      })
      .catch((error) => {
        toast.error(error.message ?? "Failed to create registration");
      });
  };

  const handleUpdateRegistration = async (values: RegistrationFormValues) => {
    if (!editingRegistration) return;
    await updateRegistrationMutation
      .mutateAsync(
        {
          id: editingRegistration.id,
          data: values as RegistrationUpdateInput,
        },
        {
          onSuccess: () => {
            toast.success("Registration updated");
            queryClient.invalidateQueries({ queryKey: registrationQueries.lists() });
            queryClient.invalidateQueries({ queryKey: registrationQueries.details() });
            setEditingRegistration(null);
          },
        },
      )
      .catch((error) => {
        toast.error(error.message ?? "Failed to update registration");
      });
  };

  const handleDeleteRegistration = async () => {
    if (!deleteTarget) return;
    await deleteRegistrationMutation
      .mutateAsync(deleteTarget.id, {
        onSuccess: () => {
          toast.success("Registration deleted");
          queryClient.invalidateQueries({ queryKey: registrationQueries.lists() });
          setDeleteTarget(null);
        },
      })
      .catch((error) => {
        toast.error(error.message ?? "Failed to delete registration");
      });
  };

  const statusFilterValue =
    filters.status && STATUS_OPTIONS.some((item) => item.value === filters.status)
      ? (filters.status as (typeof STATUS_OPTIONS)[number]["value"])
      : "all";

  const emptyStateComponent = (
    <div className="flex flex-col items-center gap-4 py-8">
      <p className="text-muted-foreground text-sm">No registrations yet</p>
      <p className="text-muted-foreground text-sm">
        Create an enrolment to link learners with active courses.
      </p>
      <Button onClick={() => setIsCreateOpen(true)}>Register learner</Button>
    </div>
  );

  return (
    <Page className="mx-auto w-full max-w-7xl p-6 lg:p-8">
      <Stack>
        <div className="flex flex-col gap-2">
          <Typography.H1>Course registrations</Typography.H1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Track learner progress, manage enrolments, and keep completion records aligned with
            course schedules.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border bg-background p-4 shadow-sm">
          <Row gap="between" className="flex-wrap">
            <Row className="flex-1 flex-wrap gap-3">
              <Select
                value={filters.courseId ?? "all"}
                onValueChange={(value) => {
                  setFilters({
                    courseId: value === "all" ? undefined : value,
                    page: 1,
                  });
                }}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All courses</SelectItem>
                  {courseOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.learnerId ?? "all"}
                onValueChange={(value) => {
                  setFilters({
                    learnerId: value === "all" ? undefined : value,
                    page: 1,
                  });
                }}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Learner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All learners</SelectItem>
                  {learnerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={statusFilterValue}
                onValueChange={(value) => {
                  setFilters({
                    status: value === "all" ? undefined : value,
                    page: 1,
                  });
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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
                <Button>Register learner</Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Enroll learner to course</DialogTitle>
                  <DialogDescription>
                    Select a learner and course to create a new enrolment record. Capacity and
                    conflicts will be validated before saving.
                  </DialogDescription>
                </DialogHeader>
                <RegistrationForm
                  learners={learnerOptions}
                  courses={courseOptions}
                  courseMeta={courseMeta}
                  onSubmit={handleCreateRegistration}
                  onCancel={() => setIsCreateOpen(false)}
                  submitLabel={
                    createRegistrationMutation.isPending ? "Creating…" : "Create registration"
                  }
                />
              </DialogContent>
            </Dialog>
          </Row>

          <DataTable
            table={table}
            isLoading={registrationsQuery.isLoading}
            emptyStateComponent={emptyStateComponent}
            emptyStateText="No registrations found."
            showPagination={true}
            dataCount={totalCount}
          />
        </div>
      </Stack>

      <Dialog
        open={Boolean(editingRegistration)}
        onOpenChange={(open) => !open && setEditingRegistration(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit registration</DialogTitle>
            <DialogDescription>
              Update enrolment status, completion details, or supporting notes.
            </DialogDescription>
          </DialogHeader>
          {editingRegistration && (
            <RegistrationForm
              learners={learnerOptions}
              courses={courseOptions}
              courseMeta={courseMeta}
              initialValues={{
                learnerId: editingRegistration.learnerId,
                courseId: editingRegistration.courseId,
                status: editingRegistration.status,
                registeredAt: editingRegistration.registeredAt
                  ? new Date(editingRegistration.registeredAt)
                  : null,
                completedAt: editingRegistration.completedAt
                  ? new Date(editingRegistration.completedAt)
                  : null,
                score: editingRegistration.score ?? undefined,
                certificateUrl: editingRegistration.certificateUrl ?? "",
                notes: editingRegistration.notes ?? "",
              }}
              onSubmit={handleUpdateRegistration}
              onCancel={() => setEditingRegistration(null)}
              submitLabel={
                updateRegistrationMutation.isPending ? "Updating…" : "Update registration"
              }
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
            <AlertDialogTitle>Delete registration</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the enrolment record. Ensure completion evidence is archived before
              deleting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteRegistrationMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDeleteRegistration}
              disabled={deleteRegistrationMutation.isPending}
            >
              {deleteRegistrationMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}
