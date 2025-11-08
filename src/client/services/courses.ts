import { eden } from "@/client/lib/eden";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export type CourseListParams = {
  page?: number;
  limit?: number;
  search?: string;
  published?: boolean;
  sort?: "createdAt" | "title" | "startDate";
  order?: "asc" | "desc";
};
export type CourseCreateInput = Parameters<typeof eden.admin.courses.post>[0];
export type CourseUpdateInput = Parameters<ReturnType<typeof eden.admin.courses>["patch"]>[0];
export type CourseListResponse = Awaited<ReturnType<typeof eden.admin.courses.get>>;
export type CourseEntity = CourseListResponse["data"][number];

export const courseQueries = {
  all: () => ["courses"] as const,
  lists: () => [...courseQueries.all(), "list"] as const,
  details: () => [...courseQueries.all(), "detail"] as const,
  list: (filters: CourseListParams) =>
    queryOptions({
      queryKey: [...courseQueries.lists(), filters],
      queryFn: () =>
        eden.admin.courses.get({
          query: {
            page: filters.page ?? 1,
            limit: filters.limit ?? 10,
            search: filters.search ?? undefined,
            published: filters.published ?? undefined,
            sort: filters.sort ?? "createdAt",
            order: filters.order ?? "desc",
          },
        } as any),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...courseQueries.details(), id] as const,
      queryFn: () => eden.admin.courses({ id }).get(),
    }),
  create: () =>
    mutationOptions({
      mutationFn: (input: Parameters<typeof eden.admin.courses.post>[0]) =>
        eden.admin.courses.post(input),
    }),
  update: (id: string) =>
    mutationOptions({
      mutationFn: (input: CourseUpdateInput) =>
        eden.admin.courses({ id }).patch(input),
    }),
  remove: () =>
    mutationOptions({
      mutationFn: (id: string) => eden.admin.courses({ id }).delete(),
    }),
};
