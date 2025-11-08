import { cn } from "@/client/lib/utils";
import { ReactNode, ElementType, ComponentPropsWithoutRef } from "react";

interface FormContainerProps<T extends ElementType = "div"> {
  children: ReactNode;
  className?: string;
  as?: T;
}

export const FormContainer = <T extends ElementType = "div">({
  children,
  className,
  as,
  ...props
}: FormContainerProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof FormContainerProps<T>>) => {
  const Component = as || "div";

  return (
    <Component
      className={cn(
        "flex flex-col space-y-4 2.5xl:space-y-5 w-full sm:w-3/5 md:w-[90%] lg:w-full lg:max-w-[24rem] 2.5xl:max-w-[28rem] mx-auto",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
