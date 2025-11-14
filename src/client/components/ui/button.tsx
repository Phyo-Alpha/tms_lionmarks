"use client";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/client/lib/utils";
import { Loading } from "./loading";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive py-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-card hover:shadow-lg hover:cursor-pointer border border-primary hover:text-primary",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-auto py-2 px-7 2.5xl:px-4 2.5xl:py-2.5 has-[>svg]:px-3",
        sm: "h-auto rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-auto rounded-md px-6 has-[>svg]:px-4",
        xl: "h-auto rounded-md px-8 has-[>svg]:px-6",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
      rounded: {
        sm: "rounded-sm",
        lg: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "full",
    },
  },
);
type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    showLoadingOnClick?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      asChild = false,
      isLoading,
      startIcon,
      endIcon,
      children,
      showLoadingOnClick = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const [isLoadingLocal, setIsLoadingLocal] = React.useState(false);

    return (
      <Comp
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size, rounded, className }),
          isLoading || isLoadingLocal ? "opacity-70" : "",
        )}
        ref={ref}
        {...props}
        onClick={async (e) => {
          if (showLoadingOnClick) {
            setIsLoadingLocal(true);
          }
          await Promise.resolve(props.onClick?.(e));
          if (showLoadingOnClick) {
            setIsLoadingLocal(false);
          }
        }}
        disabled={isLoading || isLoadingLocal || props.disabled}
      >
        {startIcon}
        {(size !== "icon" || (!isLoading && !isLoadingLocal)) && <Slottable>{children}</Slottable>}
        {isLoading || isLoadingLocal ? (
          <Loading className={cn(size !== "icon" && "ms-1")} size="sm" />
        ) : (
          endIcon
        )}
      </Comp>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants, type ButtonProps };
