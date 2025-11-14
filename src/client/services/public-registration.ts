import { eden } from "@/client/lib/eden";
import { mutationOptions, queryOptions } from "@tanstack/react-query";

export type PublicRegistrationInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  dob: Date;
  nationality: string;
  address: string;
  qualification?: string;
  englishCompetency?: string;
  vaccinated?: "Yes" | "No";
  courseId: string;
  classStartDate?: Date;
  salesperson?: string;
  hearAboutUs?: string;
};

export const publicRegistrationQueries = {
  register: () =>
    mutationOptions({
      mutationFn: (input: PublicRegistrationInput) => eden.public.register.post(input),
    }),
};

export const publicCourseQueries = {
  all: () => ["public-courses"] as const,
  list: (published?: boolean) =>
    queryOptions({
      queryKey: [...publicCourseQueries.all(), "list", published] as const,
      queryFn: () =>
        eden.public.courses.get({
          query: {
            published: published ?? true,
            limit: 100,
          },
        } as any),
    }),
};
