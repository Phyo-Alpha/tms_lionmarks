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
  DialogTrigger,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/client/components/ui/empty";
import { Input } from "@/client/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/client/components/ui/pagination";
import { Spinner } from "@/client/components/ui/spinner";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast } from "sonner";

import {
  learnerQueries,
  type LearnerCreateInput,
  type LearnerEntity,
  type LearnerListParams,
  type LearnerUpdateInput,
} from "@/client/services/learners";
import { LearnerForm, type LearnerFormValues } from "@/client/features/admin/learners";

const STATUSES = [
  { label: "All statuses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
] as const;

const LIMIT_OPTIONS = [10, 20, 50] as const;

const statusBadgeVariant: Record<LearnerEntity["status"], "default" | "secondary" | "destructive"> =
  {
    active: "default",
    inactive: "secondary",
    suspended: "destructive",
  };

export default function LearnersPage() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLearner, setEditingLearner] = useState<LearnerEntity | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LearnerEntity | null>(null);

  const [filters, setFilters] = useQueryStates(
    {
      search: parseAsString
        .withDefault("")
        .withOptions({ history: "replace", throttleMs: 300, clearOnDefault: true }),
      status: parseAsString.withOptions({ history: "replace", clearOnDefault: true }),
      page: parseAsInteger.withDefault(1).withOptions({ history: "replace" }),
      limit: parseAsInteger.withDefault(10).withOptions({ history: "replace" }),
    },
    { shallow: false },
  );

  const normalizedFilters = useMemo<LearnerListParams>(() => {
    const search = filters.search?.trim();
    const status = filters.status;
    const base: LearnerListParams = {
      page: filters.page ?? 1,
      limit: filters.limit ?? 10,
      sort: "createdAt",
      order: "desc",
    };

    if (search) {
      base.search = search;
    }

    if (status === "active" || status === "inactive" || status === "suspended") {
      base.status = status;
    }

    return base;
  }, [filters]);

  const learnersQuery = useQuery(learnerQueries.list(normalizedFilters));

  const createLearnerMutation = useMutation(learnerQueries.create());

  const updateLearnerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: LearnerUpdateInput }) => {
      const mutation = learnerQueries.update(id);
      return mutation.mutationFn(data);
    },
  });

  const deleteLearnerMutation = useMutation({
    mutationFn: (id: string) => learnerQueries.remove().mutationFn(id),
  });

  const learners = learnersQuery.data?.data ?? [];
  const pagination = learnersQuery.data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const currentPage = pagination?.page ?? normalizedFilters.page ?? 1;

  const handleCreateLearner = async (values: LearnerFormValues) => {
    await createLearnerMutation
      .mutateAsync(values as LearnerCreateInput, {
        onSuccess: () => {
          toast.success("Learner created successfully");
          queryClient.invalidateQueries({ queryKey: learnerQueries.lists() });
          setFilters({ page: 1 });
          setIsCreateOpen(false);
        },
      })
      .catch((error) => {
        toast.error(error.message ?? "Failed to create learner");
      });
  };

  const handleUpdateLearner = async (values: LearnerFormValues) => {
    if (!editingLearner) return;
    await updateLearnerMutation
      .mutateAsync(
        {
          id: editingLearner.id,
          data: values as LearnerUpdateInput,
        },
        {
          onSuccess: () => {
            toast.success("Learner updated");
            queryClient.invalidateQueries({ queryKey: learnerQueries.lists() });
            queryClient.invalidateQueries({ queryKey: learnerQueries.details() });
            setEditingLearner(null);
          },
        },
      )
      .catch((error) => {
        toast.error(error.message ?? "Failed to update learner");
      });
  };

  const handleDeleteLearner = async () => {
    if (!deleteTarget) return;
    await deleteLearnerMutation
      .mutateAsync(deleteTarget.id, {
        onSuccess: () => {
          toast.success("Learner deleted");
          queryClient.invalidateQueries({ queryKey: learnerQueries.lists() });
          setDeleteTarget(null);
        },
      })
      .catch((error) => {
        toast.error(error.message ?? "Failed to delete learner");
      });
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
  };

  const selectedStatus =
    filters.status && STATUSES.some((item) => item.value === filters.status)
      ? filters.status
      : "all";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Learners</h1>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Maintain learner profiles, update contact details, and keep track of enrolment-ready
          trainees.
        </p>
      </header>

      <div className="flex flex-col gap-4 rounded-lg border bg-background p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <Input
              className="max-w-xs"
              value={filters.search ?? ""}
              placeholder="Search by name, email, or organization"
              onChange={(event) =>
                setFilters({
                  search: event.target.value ? event.target.value : undefined,
                  page: 1,
                })
              }
            />
            <Select
              value={selectedStatus}
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
                {STATUSES.map((option) => (
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
              <Button>Create learner</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add learner</DialogTitle>
                <DialogDescription>
                  Provide basic profile details. Learners can be enrolled into courses after
                  creation.
                </DialogDescription>
              </DialogHeader>
              <LearnerForm
                onSubmit={handleCreateLearner}
                onCancel={() => setIsCreateOpen(false)}
                submitLabel={createLearnerMutation.isPending ? "Creating…" : "Create learner"}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Organization</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {learnersQuery.isLoading && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Spinner className="size-6" />
                      <p className="text-sm text-muted-foreground">Loading learners…</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {learnersQuery.isError && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12">
                    <Empty className="border-0">
                      <EmptyHeader>
                        <EmptyTitle>Unable to load learners</EmptyTitle>
                        <EmptyDescription className="max-w-sm">
                          {(learnersQuery.error as Error).message ??
                            "Please try again in a moment."}
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}

              {!learnersQuery.isLoading && !learnersQuery.isError && learners.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-12">
                    <Empty className="border-0">
                      <EmptyHeader>
                        <EmptyTitle>No learners yet</EmptyTitle>
                        <EmptyDescription>
                          Get started by adding a learner or adjusting your filters.
                        </EmptyDescription>
                      </EmptyHeader>
                      <EmptyContent>
                        <Button onClick={() => setIsCreateOpen(true)}>Create learner</Button>
                      </EmptyContent>
                    </Empty>
                  </TableCell>
                </TableRow>
              )}

              {learners.map((learner) => (
                <TableRow key={learner.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {learner.firstName} {learner.lastName}
                      </span>
                      {learner.phone && (
                        <span className="text-xs text-muted-foreground">{learner.phone}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[220px] truncate">{learner.email}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {learner.organization ?? <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant[learner.status]}>
                      {learner.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{dayjs(learner.createdAt).format("DD MMM YYYY")}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingLearner(learner)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(learner)}
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
        open={Boolean(editingLearner)}
        onOpenChange={(open) => !open && setEditingLearner(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit learner</DialogTitle>
            <DialogDescription>Update profile details for this learner.</DialogDescription>
          </DialogHeader>
          {editingLearner && (
            <>
              <LearnerForm
                initialValues={{
                  firstName: editingLearner.firstName,
                  lastName: editingLearner.lastName,
                  email: editingLearner.email,
                  phone: editingLearner.phone ?? "",
                  organization: editingLearner.organization ?? "",
                  status: editingLearner.status,
                  metadata: editingLearner.metadata ?? "",
                }}
                onSubmit={handleUpdateLearner}
                onCancel={() => setEditingLearner(null)}
                submitLabel={updateLearnerMutation.isPending ? "Updating..." : "Update learner"}
              />
              {editingLearner.metadata && (
                <DialogFooter>
                  <span className="text-xs text-muted-foreground">
                    Notes: {editingLearner.metadata}
                  </span>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete learner</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the learner record. Registrations must be withdrawn
              before deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLearnerMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDeleteLearner}
              disabled={deleteLearnerMutation.isPending}
            >
              {deleteLearnerMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
