import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/client/components/ui/form";
import { cn } from "@/client/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Control } from "react-hook-form";

import { Checkbox } from "../checkbox";

const formCheckboxVariants = cva(
  "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4",
);

export type FormCheckboxProps<C extends { [k: string]: any } = any> = Omit<
  React.ComponentPropsWithoutRef<typeof Checkbox>,
  "control" | "name" | "value" | "onCheckedChange"
> &
  VariantProps<typeof formCheckboxVariants> & {
    name: keyof C extends string ? keyof C : string;
    control?: Control<C>;
    label?: React.ReactNode;
    FormItemProps?: React.ComponentPropsWithoutRef<typeof FormItem>;
    FormControlProps?: React.ComponentPropsWithoutRef<typeof FormControl>;
    FormFieldProps?: React.ComponentPropsWithoutRef<typeof FormField>;
    FormDescriptionProps?: React.ComponentPropsWithoutRef<typeof FormDescription>;
    FormLabelProps?: React.ComponentPropsWithoutRef<typeof FormLabel>;
    checked?: boolean; // Add checked prop
    onCheckedChange?: (checked: boolean) => void; // Add onCheckedChange prop
  };

const FormCheckbox = ({
  ref,
  label,
  name,
  control,
  className,
  FormControlProps,
  FormDescriptionProps,
  FormItemProps,
  FormFieldProps,
  FormLabelProps,

  // Destructure checked prop
  checked,

  // Destructure onCheckedChange prop
  onCheckedChange,

  ...props
}: FormCheckboxProps & {
  ref: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <FormField
      name={name}
      control={control}
      {...FormFieldProps}
      render={({ field }) => {
        return (
          <FormItem
            ref={ref}
            {...FormItemProps}
            className={cn(formCheckboxVariants({ className }), FormItemProps?.className)}
          >
            <FormControl {...FormControlProps}>
              <Checkbox
                {...props}
                checked={checked ?? field.value} // Support both controlled and uncontrolled usage
                onCheckedChange={(checkedValue) => {
                  field.onChange(checkedValue);
                  if (onCheckedChange) onCheckedChange(checkedValue === true);
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel {...FormLabelProps} className={cn(FormLabelProps?.className)}>
                {label}
              </FormLabel>
              <FormDescription {...FormDescriptionProps} />
              <FormMessage />
              {FormItemProps?.children}
            </div>
          </FormItem>
        );
      }}
    />
  );
};

FormCheckbox.displayName = "FormCheckbox";

export { FormCheckbox, formCheckboxVariants };
