import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { cn } from "@/client/lib/utils";
import type { SelectProps } from "@radix-ui/react-select";
import { Info } from "lucide-react";
import React, { useState } from "react";
import { Control } from "react-hook-form";

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../form";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../hover-card";
import { Loading } from "../loading";

export type FormSelectProps<C extends { [k: string]: any } = any> = Omit<
  SelectProps,
  "value" | "onValueChange"
> & {
  name: keyof C extends string ? keyof C : string;
  items: { label: string; value: string; icon?: React.ReactNode }[];
  value?: string;
  clearable?: boolean;
  onChange?: (value: string) => void;
  control?: Control<C>;
  label?: React.ReactNode;
  description?: string;
  FormItemProps?: React.ComponentPropsWithoutRef<typeof FormItem>;
  FormFieldProps?: React.ComponentPropsWithoutRef<typeof FormField>;
  FormControlProps?: React.ComponentPropsWithoutRef<typeof FormControl>;
  FormDescriptionProps?: React.ComponentPropsWithoutRef<typeof FormDescription>;
  FormLabelProps?: React.ComponentPropsWithoutRef<typeof FormLabel>;
  className?: string;
  // Use these if you passing items from queries
  isLoading?: boolean;
  isError?: boolean;
  noFormMessage?: boolean;
  variant?: "row" | "column";
};

const FormSelect = ({
  ref,
  label,
  description,
  name,
  control,
  value,
  onChange,
  items,
  className,
  FormItemProps,
  FormFieldProps,
  FormControlProps,
  FormLabelProps,
  FormDescriptionProps,
  isLoading,
  isError,
  clearable,
  required,
  noFormMessage,
  disabled,
  variant = "column",
  ...props
}: FormSelectProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  const [opened, setIsOpen] = useState(false);

  return (
    <FormField
      name={name}
      control={control}
      {...FormFieldProps}
      render={({ field }) => (
        <FormItem ref={ref} {...FormItemProps} className={cn(FormItemProps?.className)}>
          <FormControl {...FormControlProps}>
            <div
              className={cn(
                "group w-full",
                variant === "row"
                  ? "flex flex-row items-center gap-4"
                  : "flex flex-col gap-2 align-center",
              )}
            >
              <div className="relative z-0 w-full">
                <FormLabel
                  {...FormLabelProps}
                  htmlFor={"select-" + field.name}
                  className={cn(
                    FormLabelProps?.className,
                    "flex flex-row gap-1 font-normal whitespace-nowrap",
                    !label && "hidden",
                    label &&
                      "text-muted-foreground absolute top-1/2 left-4 z-10 origin-[0] -translate-y-1/2 scale-100 transform px-1 p duration-300 font-medium",
                    label &&
                      (opened || field.value) &&
                      "bg-card text-primary font-medium top-1.5 -translate-y-4 scale-75",
                    disabled && "opacity-50",
                  )}
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
                  {required && <span className="text-destructive">*</span>}
                </FormLabel>
                <div className="peer block appearance-none" id={"select-" + field.name}>
                  <Select
                    value={
                      value ??
                      (typeof field.value === "number" ? field.value.toString() : field.value) ??
                      ""
                    }
                    name={String(field.name)}
                    onValueChange={(value) => {
                      field.onChange(value === "none" ? undefined : value);
                      onChange?.(value);
                    }}
                    {...props}
                    onOpenChange={(open) => {
                      setIsOpen(open);
                      props.onOpenChange?.(open);
                    }}
                  >
                    <SelectTrigger
                      className={cn(
                        "min-h-0 w-full min-w-0",
                        className,
                        disabled && "cursor-not-allowed",
                        opened && "border-ring",
                      )}
                      clearable={clearable}
                      onClear={() => {
                        field.onChange(undefined);
                        onChange?.("");
                      }}
                      disabled={disabled}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      {isLoading && <Loading />}
                      {isError && <p className="text-destructive">An error occurred</p>}
                      {!isLoading && (
                        <SelectItem value="none" disabled>
                          <p className="flex w-full flex-row items-center gap-2">-</p>
                        </SelectItem>
                      )}
                      {!isLoading &&
                        items.map(({ label, value, icon }, i) => (
                          <SelectItem key={i} value={value}>
                            <p className="flex w-full flex-row items-center gap-2">
                              {icon} <span>{label}</span>
                            </p>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {!noFormMessage && <FormMessage className="self-start pt-2" />}
              <FormDescription
                {...FormDescriptionProps}
                className={cn(
                  FormDescriptionProps?.className,
                  !FormDescriptionProps?.title && "hidden",
                )}
              />
              {FormItemProps?.children}
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

FormSelect.displayName = "FormSelect";

export default FormSelect;
