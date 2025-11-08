import { cn } from "@/client/lib/utils";
import { ComponentPropsWithoutRef } from "react";

export type TableActionsRowProps = ComponentPropsWithoutRef<"div">;
export function TableActionsRow({ className, ...props }: TableActionsRowProps) {
  return <div {...props} className={cn("flex flex-row flex-wrap justify-end gap-5", className)} />;
}
