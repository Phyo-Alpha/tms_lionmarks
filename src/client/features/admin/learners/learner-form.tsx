"use client";

import { Form } from "@/client/components/ui/form";
import { FormInput } from "@/client/components/ui/form/form-input";
import FormSelect from "@/client/components/ui/form/form-select";
import { FormTextarea } from "@/client/components/ui/form/form-textarea";
import { FormSubmit } from "@/client/components/ui/form/form-submit";
import { Button } from "@/client/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const learnerFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Provide a valid email"),
  phone: z.string().optional(),
  organization: z.string().optional(),
  status: z.enum(["active", "inactive", "suspended"]),
  metadata: z.string().optional(),
});

export type LearnerFormValues = z.infer<typeof learnerFormSchema>;

const defaultValues: LearnerFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  organization: "",
  status: "active",
  metadata: "",
};

type LearnerFormProps = {
  initialValues?: Partial<LearnerFormValues>;
  onSubmit: (values: LearnerFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
};

export function LearnerForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save learner",
}: LearnerFormProps) {
  const form = useForm<LearnerFormValues>({
    resolver: zodResolver(learnerFormSchema),
    defaultValues: {
      ...defaultValues,
      ...initialValues,
      metadata: initialValues?.metadata ?? "",
      phone: initialValues?.phone ?? "",
      organization: initialValues?.organization ?? "",
    },
  });

  useEffect(() => {
    form.reset({
      ...defaultValues,
      ...initialValues,
      metadata: initialValues?.metadata ?? "",
      phone: initialValues?.phone ?? "",
      organization: initialValues?.organization ?? "",
    });
  }, [initialValues, form]);

  const handleSubmit = async (values: LearnerFormValues) => {
    await onSubmit({
      ...values,
      phone: values.phone?.trim() || undefined,
      organization: values.organization?.trim() || undefined,
      metadata: values.metadata?.trim() || undefined,
    });
  };

  return (
    <Form {...form}>
      <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput name="firstName" label="First name" placeholder="First name" />
          <FormInput name="lastName" label="Last name" placeholder="Last name" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput
            name="email"
            label="Email"
            placeholder="Email"
            InputProps={{ type: "email" }}
          />
          <FormInput name="phone" label="Phone" placeholder="Phone number" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput name="organization" label="Organization" placeholder="Organization" />
          <FormSelect
            name="status"
            label="Status"
            control={form.control}
            items={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "Suspended", value: "suspended" },
            ]}
          />
        </div>
        <FormTextarea
          name="metadata"
          label="Notes"
          placeholder="Additional notes about the learner"
          TextAreaProps={{ rows: 4 }}
        />
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
