import type { RadioGroupProps } from "@radix-ui/react-radio-group";

import { FormControl, FormItem, FormLabel } from "../form";
import { RadioGroup, RadioGroupItem } from "../radio-group";
import type { FormFieldItemProps } from "./form-field-item";
import { FormFieldItem } from "./form-field-item";

export type FormRadioGroupProps<
  TOptions extends { label: string; value: string }[],
  C extends { [k: string]: any } = any,
> = Omit<FormFieldItemProps<C>, "children"> & {
  options: TOptions;
  RadioGroupProps?: RadioGroupProps;
  onChangeEffect?: (value: TOptions[number]["value"]) => void;
};

export function FormRadioGroup<
  TValue extends string,
  TOptions extends { label: string; value: TValue }[],
>({
  options,
  inputClassName,
  onChangeEffect,
  RadioGroupProps,
  ...props
}: FormRadioGroupProps<TOptions>) {
  return (
    <FormFieldItem {...props}>
      {({ onChange, value }) => (
        <RadioGroup
          onValueChange={(value) => {
            onChange(value);
            onChangeEffect?.(value as any);
          }}
          value={value}
          className={inputClassName}
          {...RadioGroupProps}
        >
          {options.map((option) => (
            <FormItem key={option.value} className="flex items-center space-y-0 space-x-3">
              <FormControl>
                <RadioGroupItem value={option.value} />
              </FormControl>
              <FormLabel className="font-normal">{option.label}</FormLabel>
            </FormItem>
          ))}
        </RadioGroup>
      )}
    </FormFieldItem>
  );
}
