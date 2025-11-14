import { cn } from "@/client/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

export const InputVariants = cva(
  "flex bg-card transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed h-10",
  {
    variants: {
      inputBox: {
        default: "standardRoundness border border-input px-3 p",
      },
      inputSize: {
        default: "inputFieldHeight w-full",
        sm: "h-10 w-96",
        tableCell: "h-12 w-full",
        box: "size-10",
      },
    },
    defaultVariants: {
      inputBox: "default",
      inputSize: "default",
    },
  },
);

export type InputProps = React.ComponentProps<"input"> & VariantProps<typeof InputVariants>;
const Input = ({ ref, className, type, inputBox, inputSize, ...props }: InputProps) => {
  return (
    <input
      type={type}
      className={cn(InputVariants({ inputBox, inputSize, className }))}
      ref={ref}
      {...props}
      value={props.value ?? ""}
    />
  );
};
Input.displayName = "Input";

export { Input };
