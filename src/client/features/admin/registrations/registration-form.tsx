"use client";

import { Form } from "@/client/components/ui/form";
import FormSelect from "@/client/components/ui/form/form-select";
import { FormDatePicker } from "@/client/components/ui/form/form-date-picker";
import { FormInput } from "@/client/components/ui/form/form-input";
import { FormTextarea } from "@/client/components/ui/form/form-textarea";
import { FormSubmit } from "@/client/components/ui/form/form-submit";
import { Button } from "@/client/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import dayjs from "dayjs";

const registrationFormSchema = z
  .object({
    learnerId: z.string().min(1, "Learner is required"),
    courseId: z.string().min(1, "Course is required"),
    status: z.enum(["enrolled", "in_progress", "completed", "withdrawn"]),
    registeredAt: z.date().nullable().optional(),
    completedAt: z.date().nullable().optional(),
    score: z
      .string()
      .or(z.number())
      .or(z.null())
      .or(z.undefined())
      .refine(
        (val) => {
          if (val === "" || val === null || val === undefined) return true;
          const num = typeof val === "string" ? Number(val) : val;
          return Number.isFinite(num) && num >= 0 && num <= 100 && Number.isInteger(num);
        },
        { message: "Score must be a number between 0 and 100" },
      )
      .transform((val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const num = typeof val === "string" ? Number(val) : val;
        return Number.isFinite(num) ? num : undefined;
      })
      .pipe(z.number().int().min(0).max(100).optional()),
    certificateUrl: z
      .string()
      .refine((val) => val === "" || z.string().url().safeParse(val).success, {
        message: "Provide a valid URL",
      })
      .transform((val) => (val === "" ? undefined : val))
      .pipe(z.string().url().optional()),
    notes: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (values.completedAt && values.status !== "completed") {
      ctx.addIssue({
        code: "custom",
        message: "Status must be completed when a completion date is set",
        path: ["status"],
      });
    }
  });

export type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

const defaultValues: RegistrationFormValues = {
  learnerId: "",
  courseId: "",
  status: "enrolled",
  registeredAt: null,
  completedAt: null,
  score: undefined,
  certificateUrl: "",
  notes: "",
};

type Option = {
  label: string;
  value: string;
};

type RegistrationFormProps = {
  learners: Option[];
  courses: Option[];
  courseMeta?: Record<
    string,
    {
      startDate?: Date | null;
      endDate?: Date | null;
      capacity?: number | null;
      isPublished?: boolean | null;
    }
  >;
  initialValues?: Partial<RegistrationFormValues>;
  onSubmit: (values: RegistrationFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
};

export function RegistrationForm({
  learners,
  courses,
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save registration",
  courseMeta,
}: RegistrationFormProps) {
  const form = useForm({
    resolver: zodResolver(registrationFormSchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      score: initialValues?.score,
      registeredAt: initialValues?.registeredAt ?? null,
      completedAt: initialValues?.completedAt ?? null,
      certificateUrl: initialValues?.certificateUrl ?? "",
      notes: initialValues?.notes ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      ...defaultValues,
      ...initialValues,
      score: initialValues?.score,
      registeredAt: initialValues?.registeredAt ?? null,
      completedAt: initialValues?.completedAt ?? null,
      certificateUrl: initialValues?.certificateUrl ?? "",
      notes: initialValues?.notes ?? "",
    });
  }, [form, initialValues]);

  const handleSubmit = async (values: unknown) => {
    const validated = registrationFormSchema.parse(values) as RegistrationFormValues;
    await onSubmit({
      ...validated,
      registeredAt: validated.registeredAt ?? undefined,
      completedAt: validated.completedAt ?? undefined,
      certificateUrl: validated.certificateUrl?.trim() || undefined,
      notes: validated.notes?.trim() || undefined,
    });
  };

  const selectedCourseId = form.watch("courseId");
  const selectedCourseMeta = selectedCourseId ? courseMeta?.[selectedCourseId] : undefined;
  const scheduleText =
    selectedCourseMeta?.startDate && selectedCourseMeta?.endDate
      ? `${dayjs(selectedCourseMeta.startDate).format("DD MMM YYYY")} – ${dayjs(
          selectedCourseMeta.endDate,
        ).format("DD MMM YYYY")}`
      : "Not scheduled";

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormSelect
            name="learnerId"
            label="Learner"
            control={form.control}
            items={learners}
          />
          <FormSelect
            name="courseId"
            label="Course"
            control={form.control}
            items={courses}
          />
        </div>
        <FormSelect
          name="status"
          label="Status"
          control={form.control}
          items={[
            { label: "Enrolled", value: "enrolled" },
            { label: "In progress", value: "in_progress" },
            { label: "Completed", value: "completed" },
            { label: "Withdrawn", value: "withdrawn" },
          ]}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormDatePicker name="registeredAt" label="Registered at" placeholder="Registration date" />
          <FormDatePicker name="completedAt" label="Completed at" placeholder="Completion date" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            name="score"
            label="Score"
            placeholder="Score out of 100"
            InputProps={{ type: "number", min: 0, max: 100 }}
          />
          <FormInput
            name="certificateUrl"
            label="Certificate URL"
            placeholder="https://example.com/certificate"
            InputProps={{ type: "url" }}
          />
        </div>
        <FormTextarea
          name="notes"
          label="Notes"
          placeholder="Internal notes"
          TextAreaProps={{ rows: 4 }}
        />
        {selectedCourseMeta && (
          <div className="rounded-md border bg-muted/30 p-3 text-sm">
            <p className="font-medium">Course insights</p>
            <p className="text-muted-foreground mt-1">Schedule: {scheduleText}</p>
            {typeof selectedCourseMeta.capacity === "number" && (
              <p className="text-muted-foreground">Capacity: {selectedCourseMeta.capacity} learners</p>
            )}
            <p className="text-muted-foreground">
              Publication: {selectedCourseMeta.isPublished ? "Published" : "Draft"}
            </p>
          </div>
        )}
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={form.formState.isSubmitting}>
              Cancel
            </Button>
          )}
          <FormSubmit className="w-full sm:w-auto">{submitLabel}</FormSubmit>
        </div>
      </form>
    </Form>
  );
}
