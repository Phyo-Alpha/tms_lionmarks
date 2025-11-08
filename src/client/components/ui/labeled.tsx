import { cn } from "@/client/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const LabelVariants = cva("flex gap-2", {
  variants: {
    layout: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    layout: "horizontal",
  },
});

export type LabeledProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof LabelVariants> & {
    label: string;
    labelProps?: React.HTMLAttributes<HTMLLabelElement>;
    icon?: React.ReactNode;
  };
export function Labeled({ children, label, className, layout, icon, ...props }: LabeledProps) {
  return (
    <div className={cn(LabelVariants({ layout, className }))} {...props}>
      <p className="flex items-center gap-2">
        {icon && <span className="text-foreground">{icon}</span>}
        <label className="text-foreground font-bold" {...props.labelProps}>
          {label}
          {(!layout || layout === "horizontal") && ":"}
        </label>
      </p>
      <div className={cn(layout === "vertical" ? "ml-7" : "")}>{children}</div>
    </div>
  );
}
