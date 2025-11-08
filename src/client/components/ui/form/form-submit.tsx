"use client";

import type { ButtonProps } from "@/client/components/ui/button";
import { Button } from "@/client/components/ui/button";
import { cn } from "@/client/lib/utils";
import type { ElementRef, Ref } from "react";
import { forwardRef } from "react";
import { useFormContext } from "react-hook-form";

export type FormSubmitProps = ButtonProps;
export const FormSubmit = forwardRef(
  ({ children, ...props }: FormSubmitProps, ref: Ref<ElementRef<typeof Button>>) => {
    const form = useFormContext();

    return (
      <Button
        type="submit"
        variant="default"
        size="default"
        ref={ref}
        isLoading={form?.formState.isSubmitting}
        {...props}
        className={cn(
          Object.keys(form.formState.errors).length !== 0 && "text-destructive",
          props.className,
          "w-full", // cause most form submit buttons are full width
        )}
      >
        {children ?? "Submit"}
      </Button>
    );
  },
);

FormSubmit.displayName = "FormSubmit";
