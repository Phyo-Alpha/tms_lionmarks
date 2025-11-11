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
  learnerQueries,
  type LearnerCreateInput,
  type LearnerEntity,
  type LearnerListParams,
  type LearnerUpdateInput,
} from "@/client/services/learners";
import { eden } from "@/client/lib/eden";
import { LearnerForm, type LearnerFormValues } from "@/client/features/admin/learners";
import DataTable from "@/client/components/common/data-table";
import { Page } from "@/client/components/layout/page";
import { Typography } from "@/client/components/common/typography";
import { Stack } from "@/client/components/layout/stack";
import { Row } from "@/client/components/layout/row";

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
      return eden.admin.learners({ id }).patch(data);
    },
  });

  const deleteLearnerMutation = useMutation({
    mutationFn: async (id: string) => {
      return eden.admin.learners({ id }).delete();
    },
  });

  const learners = learnersQuery.data?.data ?? [];
  const pagination = learnersQuery.data?.pagination;
  const totalCount = pagination?.totalItems ?? 0;

  const columns = useMemo<ColumnDef<LearnerEntity>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
          const learner = row.original;
          return (
            <div className="flex flex-col">
              <span className="font-medium">
                {learner.firstName} {learner.lastName}
              </span>
              {learner.phone && (
                <span className="text-xs text-muted-foreground">{learner.phone}</span>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <span className="max-w-[220px] truncate">{row.original.email}</span>,
      },
      {
        accessorKey: "organization",
        header: "Organization",
        cell: ({ row }) => {
          const org = row.original.organization;
          return org ? (
            <span className="max-w-[200px] truncate">{org}</span>
          ) : (
            <span className="text-muted-foreground">—</span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status;
          return <Badge variant={statusBadgeVariant[status]}>{status.replace("_", " ")}</Badge>;
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => dayjs(row.original.createdAt).format("DD MMM YYYY"),
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => {
          const learner = row.original;
          return (
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingLearner(learner)}>
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
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: learners,
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

  const selectedStatus =
    filters.status && STATUSES.some((item) => item.value === filters.status)
      ? filters.status
      : "all";

  const emptyStateComponent = (
    <div className="flex flex-col items-center gap-4 py-8">
      <p className="text-muted-foreground text-sm">No learners yet</p>
      <p className="text-muted-foreground text-sm">
        Get started by adding a learner or adjusting your filters.
      </p>
      <Button onClick={() => setIsCreateOpen(true)}>Create learner</Button>
    </div>
  );

  return (
    <Page className="mx-auto w-full max-w-7xl p-6 lg:p-8">
      <Stack>
        <div className="flex flex-col gap-2">
          <Typography.H1>Learners</Typography.H1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            Maintain learner profiles, update contact details, and keep track of enrolment-ready
            trainees.
          </p>
        </div>

        <div className="flex flex-col gap-4 rounded-lg border bg-background p-4 shadow-sm">
          <Row gap="between" className="flex-wrap">
            <Row className="flex-1 flex-wrap gap-3">
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
            </Row>
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
          </Row>

          <DataTable
            table={table}
            isLoading={learnersQuery.isLoading}
            emptyStateComponent={emptyStateComponent}
            emptyStateText="No learners found."
            showPagination={true}
            dataCount={totalCount}
          />
        </div>
      </Stack>

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
    </Page>
  );
}
