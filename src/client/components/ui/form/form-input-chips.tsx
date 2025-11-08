import type {
  InputChipMode,
  InputChipOptions,
  InputChipsProps,
  InputChipValue,
} from "../input-chips";
import { InputChips } from "../input-chips";
import type { FormFieldItemProps } from "./form-field-item";
import { FormFieldItem } from "./form-field-item";

export type FormInputChipsProps<
  TOptionValue extends string | number | boolean,
  TMode extends InputChipMode,
  TOptions extends InputChipOptions<TOptionValue>,
  TValue extends InputChipValue<TOptionValue, TMode, TOptions>,
> = Omit<FormFieldItemProps, "children"> & {
  InputChipsProps?: Omit<
    InputChipsProps<TOptionValue, TMode, TOptions, TValue>,
    "onChange" | "value" | "mode" | "options"
  >;
  mode: TMode;
  options: TOptions;
  onChangeEffect?: (value: TValue) => void;
};

export function FormInputChips<
  TOptionValue extends string | number | boolean,
  TMode extends InputChipMode,
  TOptions extends InputChipOptions<TOptionValue>,
  TValue extends InputChipValue<TOptionValue, TMode, TOptions>,
>({
  InputChipsProps,
  onChangeEffect,
  mode,
  options,
  inputClassName,
  ...props
}: FormInputChipsProps<TOptionValue, TMode, TOptions, TValue>) {
  return (
    <FormFieldItem {...props}>
      {({ onChange, value }) => (
        <InputChips
          mode={mode}
          onChange={(value) => {
            onChange(value);
            onChangeEffect?.(value);
          }}
          value={value}
          className={inputClassName}
          options={options}
          {...InputChipsProps}
        />
      )}
    </FormFieldItem>
  );
}
