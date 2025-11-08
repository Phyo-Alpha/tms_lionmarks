import { ReactNode, ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/client/lib/utils";

interface LinkRowProps<T extends ElementType = "div"> {
  children: ReactNode;
  className?: string;
  as?: T;
}

export const LinkRow = <T extends ElementType = "div">({
  children,
  className,
  as,
  ...props
}: LinkRowProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof LinkRowProps<T>>) => {
  const Component = as || "div";

  return (
    <Component
      className={cn(
        "flex flex-col mobile-l:flex-row justify-between items-center sm:items-start space-y-4 mobile-l:space-y-0 py-3",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
