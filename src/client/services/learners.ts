import { eden } from "@/client/lib/eden";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export type LearnerListParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "suspended";
  sort?: "createdAt" | "firstName" | "lastName";
  order?: "asc" | "desc";
};
export type LearnerCreateInput = Parameters<typeof eden.admin.learners.post>[0];
export type LearnerUpdateInput = Parameters<ReturnType<typeof eden.admin.learners>["patch"]>[0];
export type LearnerListResponse = Awaited<ReturnType<typeof eden.admin.learners.get>>;
export type LearnerEntity = LearnerListResponse["data"][number];

export const learnerQueries = {
  all: () => ["learners"] as const,
  lists: () => [...learnerQueries.all(), "list"] as const,
  details: () => [...learnerQueries.all(), "detail"] as const,
  list: (filters: LearnerListParams) =>
    queryOptions({
      queryKey: [...learnerQueries.lists(), filters],
      queryFn: () =>
        eden.admin.learners.get({
          query: {
            page: filters.page ?? 1,
            limit: filters.limit ?? 10,
            search: filters.search ?? undefined,
            status: filters.status ?? undefined,
            sort: filters.sort ?? "createdAt",
            order: filters.order ?? "desc",
          },
        } as any),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...learnerQueries.details(), id] as const,
      queryFn: () => eden.admin.learners({ id }).get(),
    }),
  create: () =>
    mutationOptions({
      mutationFn: (input: Parameters<typeof eden.admin.learners.post>[0]) =>
        eden.admin.learners.post(input),
    }),
  update: (id: string) =>
    mutationOptions({
      mutationFn: (input: LearnerUpdateInput) => eden.admin.learners({ id }).patch(input),
    }),
  remove: () =>
    mutationOptions({
      mutationFn: (id: string) => eden.admin.learners({ id }).delete(),
    }),
};
