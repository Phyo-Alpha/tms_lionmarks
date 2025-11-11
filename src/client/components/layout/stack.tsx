import { cn } from "@/client/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";

const StackVariants = cva("flex flex-col", {
  variants: {
    gap: {
      medium: "gap-4",
    },
  },
  defaultVariants: {
    gap: "medium",
  },
});

interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: VariantProps<typeof StackVariants>["gap"];
}

function Stack({ gap = "medium", className, ...props }: StackProps) {
  return <div className={cn(StackVariants({ gap, className }))} {...props} />;
}

Stack.displayName = "Stack";

export { Stack, type StackProps };
