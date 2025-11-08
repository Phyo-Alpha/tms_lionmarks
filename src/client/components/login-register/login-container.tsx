import { ReactNode, ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/client/lib/utils";

interface LoginContainerProps<T extends ElementType = "div"> {
  children: ReactNode;
  className?: string;
  as?: T;
  paddingOnly?: boolean;
}

export const LoginContainer = <T extends ElementType = "div">({
  children,
  className,
  as,
  paddingOnly = false,
  ...props
}: LoginContainerProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof LoginContainerProps<T>>) => {
  const Component = as || "div";

  const basePaddingClasses = "px-6 mobile-l:px-10 xl:px-12 2xl:px-16 2.5xl:px-20";
  const maxWidthClasses = "5xl:px-0 4xl:max-w-[56.25rem] 4xl:mx-auto";

  return (
    <Component
      className={cn(basePaddingClasses, paddingOnly ? "" : maxWidthClasses, className)}
      {...props}
    >
      {children}
    </Component>
  );
};
