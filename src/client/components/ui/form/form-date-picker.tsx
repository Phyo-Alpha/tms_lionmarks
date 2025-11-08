import { cn } from "@/client/lib/utils";
import * as React from "react";

import { DatePicker } from "../date-picker";
import { FormFieldItem, type FormFieldItemProps } from "./form-field-item";

export type FormDatePickerProps<C extends { [k: string]: any } = any> = {
  DatePickerProps?: Omit<
    React.ComponentPropsWithoutRef<typeof DatePicker>,
    "control" | "name" | "value" | "onChange"
  >;
} & Omit<FormFieldItemProps<C>, "children"> &
  Pick<React.ComponentPropsWithoutRef<typeof DatePicker>, "type" | "placeholder" | "disabled">;

const FormDatePicker = ({
  ref,
  inputClassName,
  DatePickerProps,
  type,
  placeholder,
  disabled,
  ...props
}: FormDatePickerProps & {
  ref: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <FormFieldItem {...props} ref={ref}>
      {(field) => (
        <DatePicker
          {...field}
          {...{ type, placeholder, disabled }}
          {...DatePickerProps}
          className={cn(inputClassName, DatePickerProps?.className)}
        />
      )}
    </FormFieldItem>
  );
};
FormDatePicker.displayName = "FormDatePicker";

export { FormDatePicker };
