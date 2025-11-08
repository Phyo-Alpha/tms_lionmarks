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
      .union([z.string(), z.number()])
      .optional()
      .transform((value) => {
        if (value === "" || value === undefined) return undefined;
        const numeric = typeof value === "string" ? Number(value) : value;
        return Number.isFinite(numeric) ? numeric : undefined;
      })
      .pipe(
        z
          .number({ invalid_type_error: "Score must be a number" })
          .int("Score must be a whole number")
          .min(0, "Score must be at least 0")
          .max(100, "Score must be at most 100")
          .optional(),
      ),
    certificateUrl: z.string().url("Provide a valid URL").optional(),
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
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
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

  const handleSubmit = async (values: RegistrationFormValues) => {
    await onSubmit({
      ...values,
      registeredAt: values.registeredAt ?? undefined,
      completedAt: values.completedAt ?? undefined,
      certificateUrl: values.certificateUrl?.trim() || undefined,
      notes: values.notes?.trim() || undefined,
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
            placeholder="Select learner"
          />
          <FormSelect
            name="courseId"
            label="Course"
            control={form.control}
            items={courses}
            placeholder="Select course"
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
