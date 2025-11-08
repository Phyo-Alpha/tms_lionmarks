import { cn } from "@/client/lib/utils";
import { ComponentPropsWithoutRef } from "react";

import { Label } from "../label";
import { MultiSelect, MultiSelectOptions } from "../multi-select";
import { FormFieldItem, FormFieldItemProps } from "./form-field-item";

export type FormMultiSelectProps<
  TOptionValue extends string,
  TOptions extends MultiSelectOptions<TOptionValue>,
> = Omit<FormFieldItemProps, "children"> & {
  MultiSelectProps?: Omit<
    ComponentPropsWithoutRef<typeof MultiSelect>,
    "onValueChange" | "value" | "options" | "defaultValue" | "className"
  >;
  options: TOptions;
  defaultValue?: TOptionValue[];
  className?: string;
};

export function FormMultiSelect<
  TOptionValue extends string,
  TOptions extends MultiSelectOptions<TOptionValue>,
>({
  MultiSelectProps,
  label,
  options,
  className,
  ...props
}: FormMultiSelectProps<TOptionValue, TOptions>) {
  return (
    <FormFieldItem {...props}>
      {({ onChange, value }) => (
        <div className="group relative z-0">
          <MultiSelect
            id={"multiSelect-" + props.name}
            defaultValue={value}
            onValueChange={(newValue) => {
              onChange(newValue);
            }}
            options={options}
            className={cn(className, "peer block appearance-none")}
            {...MultiSelectProps}
          />
          <Label
            htmlFor={"multiSelect-" + props.name}
            className={cn(
              "text-muted-foreground peer-focus:bg-card peer-focus:text-primary absolute top-7.5 left-4 z-10 h-fit origin-[0] -translate-y-4 scale-75 transform px-1 text-xl duration-300 peer-placeholder-shown:top-4.5 peer-placeholder-shown:left-4 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-1.5 peer-focus:-translate-y-4 peer-focus:scale-75",
              !!value &&
                value.length > 0 &&
                "bg-card text-primary top-0.5 left-4 -translate-y-4 scale-55",
            )}
          >
            {label}
          </Label>
        </div>
      )}
    </FormFieldItem>
  );
}
