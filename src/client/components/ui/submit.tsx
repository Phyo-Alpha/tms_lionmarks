import { cn } from "@/client/lib/utils";
import { LucideLoader } from "lucide-react";
import { ReactNode } from "react";

import { Button, ButtonProps } from "./button";

export type SubmitProps = ButtonProps & {
  startIcon?: ReactNode;
};

export function Submit({ children, className, startIcon, ...props }: SubmitProps) {
  return (
    <Button
      className={cn("flex w-full flex-row items-center justify-between", className)}
      type="submit"
      {...props}
    >
      {startIcon && <span className="mr-2">{startIcon}</span>}
      {children}
      <LucideLoader className="bg-primary text-primary-foreground ml-2 rounded-full" />
    </Button>
  );
}
