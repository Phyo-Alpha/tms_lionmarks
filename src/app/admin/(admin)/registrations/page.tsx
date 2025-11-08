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
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/client/components/ui/empty";
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
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? normalizedFilters.page ?? 1;

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

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const statusFilterValue =
    filters.status && STATUS_OPTIONS.some((item) => item.value === filters.status)
      ? (filters.status as (typeof STATUS_OPTIONS)[number]["value"])
      : "all";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Course registrations
        </h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Track learner progress, manage enrolments, and keep completion records aligned with course
          schedules.
        </p>
      </header>

      <div className="flex flex-col gap-4 rounded-lg border bg-background p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
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
          </div>
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
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Learner</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Completed</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrationsQuery.isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Spinner className="size-6" />
                      <p className="text-sm text-muted-foreground">Loading registrations…</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {registrationsQuery.isError && (
                <TableRow>
                  <TableCell colSpan={7} className="py-12">
                    <Empty className="border-0">
                      <EmptyHeader>
                        <EmptyTitle>Unable to load registrations</EmptyTitle>
                        <EmptyDescription className="max-w-sm">
                          {(registrationsQuery.error as Error).message ?? "Please try again later."}
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}

              {!registrationsQuery.isLoading &&
                !registrationsQuery.isError &&
                registrations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-12">
                      <Empty className="border-0">
                        <EmptyHeader>
                          <EmptyTitle>No registrations yet</EmptyTitle>
                          <EmptyDescription>
                            Create an enrolment to link learners with active courses.
                          </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                          <Button onClick={() => setIsCreateOpen(true)}>Register learner</Button>
                        </EmptyContent>
                      </Empty>
                    </TableCell>
                  </TableRow>
                )}

              {registrations.map((registration) => (
                <TableRow key={registration.id}>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {registration.course?.title ?? "Course removed"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {registration.course?.code ?? "—"}
                      </span>
                      {typeof registration.course?.capacity === "number" && (
                        <span className="text-[11px] text-muted-foreground">
                          Capacity {registration.course.capacity}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[registration.status]}>
                      {registration.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {registration.registeredAt
                      ? dayjs(registration.registeredAt).format("DD MMM YYYY")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {registration.completedAt
                      ? dayjs(registration.completedAt).format("DD MMM YYYY")
                      : "—"}
                  </TableCell>
                  <TableCell>{registration.score ?? "—"}</TableCell>
                  <TableCell className="text-right">
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
                  </TableCell>
                </TableRow>
              ))}
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
    </div>
  );
}
