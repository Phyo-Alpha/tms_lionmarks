import * as React from "react";

import { Switch } from "../switch";
import type { FormFieldItemProps } from "./form-field-item";
import { FormFieldItem } from "./form-field-item";

export type FormSwitchProps<C extends { [k: string]: any } = any> = Omit<
  FormFieldItemProps<C>,
  "children"
> &
  Omit<React.ComponentPropsWithoutRef<typeof Switch>, "checked" | "onCheckedChange">;

const FormSwitch = ({
  ref,
  itemRef,
  ...props
}: FormSwitchProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <FormFieldItem {...props} ref={ref}>
      {(field) => (
        <Switch checked={field.value} itemRef={itemRef} onCheckedChange={field.onChange} />
      )}
    </FormFieldItem>
  );
};
FormSwitch.displayName = "FormSwitch";

export { FormSwitch };
