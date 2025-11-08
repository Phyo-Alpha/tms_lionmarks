import { ReactNode, ElementType, ComponentPropsWithoutRef } from "react";
import { cn } from "@/client/lib/utils";

interface LoginFormSectionProps<T extends ElementType = "div"> {
  children: ReactNode;
  className?: string;
  as?: T;
}

export const LoginFormSection = <T extends ElementType = "div">({
  children,
  className,
  as,
  ...props
}: LoginFormSectionProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof LoginFormSectionProps<T>>) => {
  const Component = as || "div";

  return (
    <Component className={cn("w-full md:w-[58%]", className)} {...props}>
      {children}
    </Component>
  );
};
