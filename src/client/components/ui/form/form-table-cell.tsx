import { cn } from "@/client/lib/utils";
import * as React from "react";

import { Input } from "../input";
import { TableCell } from "../table";
import type { FormFieldItemProps } from "./form-field-item";
import { FormFieldItem } from "./form-field-item";

export type FormTableCellProps<C extends { [k: string]: any } = any> = {
  InputProps?: Omit<React.ComponentPropsWithoutRef<typeof Input>, "name">;
  inputRef?: React.Ref<HTMLInputElement>; // Add ref for the input element
  required?: boolean;
} & Omit<FormFieldItemProps<C>, "children"> &
  Pick<React.ComponentPropsWithoutRef<typeof Input>, "type" | "placeholder" | "disabled">;

const FormTableCell = ({
  ref,
  inputClassName,
  InputProps,

  // Accept inputRef prop
  inputRef,

  type,
  placeholder,
  disabled,
  ...props
}: FormTableCellProps & {
  ref: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <FormFieldItem {...props} ref={ref} className="min-h-full">
      {(field) => (
        <TableCell className="flex min-w-full flex-1 border-2 border-r-0">
          <input
            {...field}
            {...{ type, placeholder, disabled }}
            {...InputProps}
            ref={inputRef} // Pass inputRef to Input
            value={field.value ?? ""}
            className={cn(inputClassName, "min-h-full w-full bg-transparent pl-4")}
          />
        </TableCell>
      )}
    </FormFieldItem>
  );
};
FormTableCell.displayName = "FormTableCell";

export { FormTableCell };
