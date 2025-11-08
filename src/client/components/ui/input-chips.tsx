import { cn } from "@/client/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

import type { ButtonProps } from "./button";
import { Button } from "./button";

export type InputChipMode = "single" | "multiple";
export type InputChipOptions<TOptionValue extends string | number | boolean> = readonly {
  label: string;
  value: TOptionValue;
}[];
export type InputChipValue<
  TOptionValue extends string | number | boolean,
  TMode extends InputChipMode,
  TOptions extends InputChipOptions<TOptionValue>,
> = TMode extends "single" ? TOptions[number]["value"] : TOptions[number]["value"][];
export type InputChipsProps<
  TOptionValue extends string | number | boolean,
  TMode extends InputChipMode,
  TOptions extends InputChipOptions<TOptionValue>,
  TValue extends InputChipValue<TOptionValue, TMode, TOptions>,
> = Omit<ComponentPropsWithoutRef<"div">, "onChange" | "value" | "children"> & {
  options: TOptions;
  onChange: (value: TValue) => void;
  value: TValue;
  mode: TMode;
  ButtonProps?: ButtonProps;
};
export function InputChips<
  TOptionValue extends string | number | boolean,
  TMode extends InputChipMode,
  TOptions extends InputChipOptions<TOptionValue>,
  TValue extends InputChipValue<TOptionValue, TMode, TOptions>,
>({
  className,
  value,
  options,
  mode,
  onChange,
  ButtonProps,
  ...props
}: InputChipsProps<TOptionValue, TMode, TOptions, TValue>) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)} {...props}>
      {options.map((option) => (
        <Button
          key={option.value.toString()}
          variant={
            (
              mode === "single"
                ? value === (option.value as any)
                : (value as any[]).includes(option.value as any)
            )
              ? "default"
              : "outline"
          }
          onClick={() => {
            if (mode === "multiple") {
              const arr = value as TOptionValue[];
              const newValue = arr.includes(option.value)
                ? arr.filter((v) => v !== option.value)
                : [...arr, option.value];
              onChange(newValue as TValue);
            } else {
              onChange(option.value as any);
            }
          }}
          {...ButtonProps}
          className={cn("min-w-32", ButtonProps?.className)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
