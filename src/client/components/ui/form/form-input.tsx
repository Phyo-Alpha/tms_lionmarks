import { cn } from "@/client/lib/utils";
import { VariantProps } from "class-variance-authority";
import * as React from "react";

import { Input, InputVariants } from "../input";
import { Label } from "../label";
import type { FormFieldItemProps } from "./form-field-item";
import { FormFieldItem } from "./form-field-item";

export type FormInputProps<C extends { [k: string]: any } = any> = {
  InputProps?: Omit<React.ComponentPropsWithoutRef<typeof Input>, "name">;
  inputRef?: React.RefObject<HTMLInputElement>;
  required?: boolean;
  icon?: React.ReactNode;
  onInputChange?: (value: string) => void;
  inputValue?: string;
} & Omit<FormFieldItemProps<C>, "children"> &
  Pick<React.ComponentPropsWithoutRef<typeof Input>, "type" | "placeholder" | "disabled"> &
  VariantProps<typeof InputVariants>;

const FormInput = ({
  ref,
  inputClassName,
  InputProps,
  inputRef,
  type,
  placeholder,
  disabled,
  inputBox,
  inputSize,
  onInputChange,
  inputValue,
  icon,
  label,
  ...props
}: FormInputProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <FormFieldItem {...props} ref={ref}>
      {(field) => (
        <div className="group relative z-0">
          <Input
            id={"input-" + field.name}
            {...field}
            {...(onInputChange && {
              onChange: (e) => {
                field.onChange(e.target.value);
                onInputChange(e.target.value);
              },
            })}
            {...{ type, placeholder, disabled }}
            {...InputProps}
            placeholder=""
            inputBox={inputBox}
            inputSize={inputSize}
            ref={inputRef}
            value={inputValue ?? field.value}
            className={cn(inputClassName, "peer block appearance-none ")}
          />
          <Label
            htmlFor={"input-" + field.name}
            className={cn(
              "text-muted-foreground peer-focus:bg-card peer-focus:text-primary absolute top-1.5 z-10 origin-left bg-card -translate-y-4 scale-75 transform px-1 p duration-300 peer-placeholder-shown:top-4.5 peer-placeholder-shown:left-4 peer-placeholder-shown:-translate-y-2 peer-placeholder-shown:bg-card 2xl:peer-placeholder-shown:-translate-y-1 2.5xl:peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-1.5 peer-focus:-translate-y-4 peer-focus:scale-75 whitespace-nowrap",
              field.value && "bg-card text-primary top-1.5 left-4  -translate-y-4 scale-75",
              disabled && "opacity-50",
            )}
          >
            {label}
          </Label>
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center pl-3 ">
              {icon}
            </div>
          )}
        </div>
      )}
    </FormFieldItem>
  );
};
FormInput.displayName = "FormInput";

export { FormInput };
