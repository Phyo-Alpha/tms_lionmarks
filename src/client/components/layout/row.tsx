import { cn } from "@/client/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

const RowVariants = cva("flex flex-row", {
  variants: {
    gap: {
      medium: "gap-4",
      "space-evenly": "justify-evenly gap-4",
      "stat-cards": "justify-evenly gap-8 [&>*]:flex-1",
      between: "justify-between",
    },
  },
  defaultVariants: {
    gap: "medium",
  },
});

interface RowProps extends HTMLAttributes<HTMLDivElement> {
  gap?: VariantProps<typeof RowVariants>["gap"];
}

function Row({ gap = "medium", className, ...props }: RowProps) {
  return <div className={cn(RowVariants({ gap, className }))} {...props} />;
}

Row.displayName = "Row";

export { Row, type RowProps };
