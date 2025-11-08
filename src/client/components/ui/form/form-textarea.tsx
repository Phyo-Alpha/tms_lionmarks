import { cn } from "@/client/lib/utils";
import * as React from "react";

import { Label } from "../label";
import { Textarea } from "../textarea";
import type { FormFieldItemProps } from "./form-field-item";
import { FormFieldItem } from "./form-field-item";

export type FormTextareaProps<C extends { [k: string]: any } = any> = {
  TextAreaProps?: Omit<React.ComponentPropsWithoutRef<typeof Textarea>, "name">;
} & Omit<FormFieldItemProps<C>, "children"> &
  Pick<React.ComponentPropsWithoutRef<typeof Textarea>, "placeholder">;

const FormTextarea = ({
  ref,
  inputClassName,
  TextAreaProps,
  placeholder,
  label,
  ...props
}: FormTextareaProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <FormFieldItem {...props} label={undefined} ref={ref}>
      {(field) => (
        <div className="group relative z-0">
          <Textarea
            id={"textarea-" + field.name}
            {...field}
            {...{ placeholder }}
            {...TextAreaProps}
            placeholder=""
            className={cn(inputClassName, "peer block appearance-none", TextAreaProps?.className)}
          />
          {label && (
            <Label
              htmlFor={"textarea-" + field.name}
              className={cn(
                "text-muted-foreground peer-focus:bg-card peer-focus:text-primary absolute top-1.5 z-10 origin-left bg-card -translate-y-4 scale-75 transform px-1 p duration-300 peer-placeholder-shown:top-3.5 peer-placeholder-shown:left-3 peer-placeholder-shown:-translate-y-2 peer-placeholder-shown:bg-card 2xl:peer-placeholder-shown:-translate-y-1 2.5xl:peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:top-1.5 peer-focus:-translate-y-4 peer-focus:scale-75",
                field.value && "bg-card text-primary top-1.5 left-3 -translate-y-4 scale-75",
              )}
            >
              {label}
            </Label>
          )}
        </div>
      )}
    </FormFieldItem>
  );
};
FormTextarea.displayName = "FormTextarea";

export { FormTextarea };
