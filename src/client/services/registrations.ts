import { eden } from "@/client/lib/eden";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export type RegistrationListParams = {
  page?: number;
  limit?: number;
  order?: "asc" | "desc";
  courseId?: string;
  learnerId?: string;
  status?: "enrolled" | "in_progress" | "completed" | "withdrawn";
};
export type RegistrationCreateInput = Parameters<typeof eden.admin.registrations.post>[0];
export type RegistrationUpdateInput = Parameters<
  ReturnType<typeof eden.admin.registrations>["patch"]
>[0];
export type RegistrationListResponse = Awaited<ReturnType<typeof eden.admin.registrations.get>>;
export type RegistrationEntity = RegistrationListResponse["data"][number];

export const registrationQueries = {
  all: () => ["registrations"] as const,
  lists: () => [...registrationQueries.all(), "list"] as const,
  details: () => [...registrationQueries.all(), "detail"] as const,
  list: (filters: RegistrationListParams) =>
    queryOptions({
      queryKey: [...registrationQueries.lists(), filters],
      queryFn: () =>
        eden.admin.registrations.get({
          query: {
            page: filters.page ?? 1,
            limit: filters.limit ?? 10,
            order: filters.order ?? "desc",
            courseId: filters.courseId ?? undefined,
            learnerId: filters.learnerId ?? undefined,
            status: filters.status ?? undefined,
          },
        } as any),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: [...registrationQueries.details(), id] as const,
      queryFn: () => eden.admin.registrations({ id }).get(),
    }),
  create: () =>
    mutationOptions({
      mutationFn: (input: Parameters<typeof eden.admin.registrations.post>[0]) =>
        eden.admin.registrations.post(input),
    }),
  update: (id: string) =>
    mutationOptions({
      mutationFn: (input: RegistrationUpdateInput) =>
        eden.admin.registrations({ id }).patch(input),
    }),
  remove: () =>
    mutationOptions({
      mutationFn: (id: string) => eden.admin.registrations({ id }).delete(),
    }),
};
