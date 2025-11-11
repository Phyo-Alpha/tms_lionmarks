"use client";

import { Form } from "@/client/components/ui/form";
import { FormInput } from "@/client/components/ui/form/form-input";
import { FormTextarea } from "@/client/components/ui/form/form-textarea";
import { FormDatePicker } from "@/client/components/ui/form/form-date-picker";
import { FormSwitch } from "@/client/components/ui/form/form-switch";
import { FormSubmit } from "@/client/components/ui/form/form-submit";
import { Button } from "@/client/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const courseFormSchema = z
  .object({
    code: z
      .string()
      .min(2, "Code must be at least 2 characters")
      .regex(/^[A-Za-z0-9\-]+$/, "Use letters, numbers, or dashes"),
    title: z.string().min(3, "Title is required"),
    description: z.string().optional(),
    durationHours: z.coerce
      .number()
      .int("Duration must be a whole number")
      .min(0, "Duration must be >= 0"),
    startDate: z.date().nullable().optional(),
    endDate: z.date().nullable().optional(),
    capacity: z
      .string()
      .or(z.number())
      .or(z.null())
      .or(z.undefined())
      .refine(
        (val) => {
          if (val === "" || val === null || val === undefined) return true;
          const num = typeof val === "string" ? Number(val) : val;
          return Number.isFinite(num) && num > 0 && Number.isInteger(num);
        },
        { message: "Capacity must be a positive whole number" },
      )
      .transform((val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const num = typeof val === "string" ? Number(val) : val;
        return Number.isFinite(num) ? num : undefined;
      })
      .pipe(z.number().int().positive().optional()),
    isPublished: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (values.startDate && values.endDate && values.endDate < values.startDate) {
      ctx.addIssue({
        code: "custom",
        message: "End date must be after start date",
        path: ["endDate"],
      });
    }
  });

export type CourseFormValues = z.infer<typeof courseFormSchema>;

const defaultValues: CourseFormValues = {
  code: "",
  title: "",
  description: "",
  durationHours: 0,
  startDate: null,
  endDate: null,
  capacity: undefined,
  isPublished: false,
};

type CourseFormProps = {
  initialValues?: Partial<CourseFormValues>;
  onSubmit: (values: CourseFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
};

export function CourseForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save course",
}: CourseFormProps) {
  const form = useForm({
    resolver: zodResolver(courseFormSchema) as any,
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      code: initialValues?.code ?? "",
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      durationHours: initialValues?.durationHours ?? 0,
      startDate: initialValues?.startDate ?? null,
      endDate: initialValues?.endDate ?? null,
      capacity: initialValues?.capacity,
      isPublished: initialValues?.isPublished ?? false,
    },
  });

  useEffect(() => {
    form.reset({
      ...defaultValues,
      ...initialValues,
      code: initialValues?.code ?? "",
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      durationHours: initialValues?.durationHours ?? 0,
      startDate: initialValues?.startDate ?? null,
      endDate: initialValues?.endDate ?? null,
      capacity: initialValues?.capacity,
      isPublished: initialValues?.isPublished ?? false,
    });
  }, [form, initialValues]);

  const handleSubmit = async (values: unknown) => {
    const validated = courseFormSchema.parse(values) as CourseFormValues;
    await onSubmit({
      ...validated,
      code: validated.code.toUpperCase(),
      description: validated.description?.trim() || undefined,
      capacity: validated.capacity ?? undefined,
      startDate: validated.startDate ?? undefined,
      endDate: validated.endDate ?? undefined,
    });
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput name="code" label="Course code" placeholder="TMS-101" />
          <FormInput name="title" label="Course title" placeholder="Course name" />
        </div>
        <FormTextarea
          name="description"
          label="Description"
          placeholder="Describe the course"
          TextAreaProps={{ rows: 4 }}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            name="durationHours"
            label="Duration (hours)"
            placeholder="12"
            InputProps={{ type: "number", min: 0 }}
          />
          <FormInput
            name="capacity"
            label="Capacity"
            placeholder="30"
            InputProps={{ type: "number", min: 1 }}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormDatePicker name="startDate" label="Start date" placeholder="Select start date" />
          <FormDatePicker name="endDate" label="End date" placeholder="Select end date" />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <span className="text-sm font-medium">Published</span>
          <FormSwitch name="isPublished" />
        </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={form.formState.isSubmitting}
            >
              Cancel
            </Button>
          )}
          <FormSubmit className="w-full sm:w-auto">{submitLabel}</FormSubmit>
        </div>
      </form>
    </Form>
  );
}
