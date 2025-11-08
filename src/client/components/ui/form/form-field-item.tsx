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
import { Info } from "lucide-react";
import * as React from "react";
import type { Control, ControllerRenderProps, Path } from "react-hook-form";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "../hover-card";

const formFieldVariants = cva("flex", {
  variants: {
    variant: {
      row: "flex-col gap-2 sm:flex-row sm:items-center",
      column: "flex-col",
    },
  },
});
const formLabelDescVariants = cva("", {
  variants: {
    variant: {
      row: "w-40 min-w-40",
      column: "",
    },
  },
});
const formLabelVariants = cva("", {
  variants: {
    variant: {
      row: "",
      column: "",
    },
  },
});

export type FormFieldItemProps<C extends { [k: string]: any } = any> = VariantProps<
  typeof formFieldVariants
> & {
  name: keyof C extends string ? keyof C : string;
  control?: Control<C>;
  label?: React.ReactNode;
  description?: string;
  FormItemProps?: React.ComponentPropsWithoutRef<typeof FormItem>;
  FormControlProps?: React.ComponentPropsWithoutRef<typeof FormControl>;
  FormFieldProps?: React.ComponentPropsWithoutRef<typeof FormField>;
  FormDescriptionProps?: React.ComponentPropsWithoutRef<typeof FormDescription>;
  FormLabelProps?: React.ComponentPropsWithoutRef<typeof FormLabel>;
  children: (props: ControllerRenderProps<C, Path<C>>) => React.ReactElement<any>;
  className?: string;
  inputClassName?: string;
  required?: boolean;
  noFormMessage?: boolean;
};

const FormFieldItem = ({
  ref,
  label,
  description,
  name,
  control,
  FormControlProps,
  FormDescriptionProps,
  FormItemProps,
  FormFieldProps,
  FormLabelProps,
  className,
  children,
  required,
  variant = "column",
  noFormMessage,
}: FormFieldItemProps & {
  ref?: React.RefObject<HTMLDivElement>;
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
            className={cn(formFieldVariants({ variant }), FormItemProps?.className, className)}
          >
            {label !== undefined && (
              <div className={cn(formLabelDescVariants({ variant }))}>
                <FormLabel
                  {...FormLabelProps}
                  className={cn(formLabelVariants({ variant }), FormLabelProps?.className)}
                >
                  {label}
                  {description && (
                    <HoverCard>
                      <HoverCardTrigger>
                        <Info size={20} />
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <p>{description}</p>
                      </HoverCardContent>
                    </HoverCard>
                  )}
                  {label && required && <span className="text-destructive px-2">*</span>}
                  {variant === "row" && label && <span className="hidden sm:inline">:</span>}
                </FormLabel>
                <FormDescription
                  {...FormDescriptionProps}
                  className={cn(
                    "hidden",
                    variant === "row" && "sm:block",
                    FormDescriptionProps?.className,
                  )}
                />
              </div>
            )}
            <div className={cn("relative", FormControlProps?.className)}>
              <FormControl {...FormControlProps}>{children(field)}</FormControl>
              {FormControlProps?.children}
            </div>
            {!noFormMessage && <FormMessage className="self-start pt-2" />}
            {FormDescriptionProps && (
              <FormDescription
                {...FormDescriptionProps}
                className={cn(variant === "row" && "sm:hidden", FormDescriptionProps?.className)}
              />
            )}
            {FormItemProps?.children}
          </FormItem>
        );
      }}
    />
  );
};
FormFieldItem.displayName = "FormFieldItem";

export { FormFieldItem, formFieldVariants, formLabelDescVariants, formLabelVariants };
