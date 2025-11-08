import { cn } from "@/client/lib/utils";
import { ComponentPropsWithoutRef } from "react";

export type FilterRowProps = ComponentPropsWithoutRef<"div">;
export function FilterRow({ className, ...props }: FilterRowProps) {
  return <div {...props} className={cn("flex flex-row flex-wrap gap-3", className)} />;
}
