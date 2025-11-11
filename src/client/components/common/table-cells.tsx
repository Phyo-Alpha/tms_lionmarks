import { cn } from "@/client/lib/utils";
import Link, { LinkProps } from "next/link";
import { HTMLAttributes, isValidElement } from "react";
import { Button } from "../ui/button";
import { LucideIcon } from "lucide-react";
import { cva, VariantProps } from "class-variance-authority";
import { Badge } from "../ui/badge";
import { Links } from "./link";

export const TableCells = {
  Actions,
  Link: TableLink,
  Badge: TableBadge,
  Status: TableStatus,
};

// Probably will change it into template file like data-table-template but for now, it just wrapper to add chevron right link icon
interface ActionsProps<R> extends HTMLAttributes<HTMLDivElement> {
  singlePageLink?: LinkProps<R>["href"];
}
function Actions<R>({ children, className, singlePageLink, ...props }: ActionsProps<R>) {
  return (
    <div className={cn("flex flex-row items-center justify-between", className)} {...props}>
      {children}
      {singlePageLink && <Links.Chevron href={singlePageLink} />}
    </div>
  );
}
Actions.displayName = "Actions";

interface TableLinkProps<R> extends LinkProps<R> {
  children: React.ReactNode;
  className?: string;
}
function TableLink<R>({ children, className, ...props }: TableLinkProps<R>) {
  return (
    <Button variant="link" className={cn("pl-0!", className)}>
      <Link {...props}>{children}</Link>
    </Button>
  );
}
TableLink.displayName = "TableLink";

const tableBadgeVariants = cva("py-1.5 px-4 gap-2 font-bold", {
  variants: {
    variant: {
      default: "",
    },
  },
});
interface TableBadgeProps extends HTMLAttributes<HTMLDivElement> {
  text: string;
  icon?: LucideIcon | React.ReactNode;
  variant?: VariantProps<typeof tableBadgeVariants>["variant"];
}

// Type guard to check if something is a component
function isComponentType(icon: any): icon is LucideIcon {
  return (
    typeof icon === "function" || (typeof icon === "object" && icon !== null && "$$typeof" in icon)
  );
}

function TableBadge({ text, icon, variant, className, ...props }: TableBadgeProps) {
  const renderIcon = () => {
    if (!icon) return null;

    // If it's already a rendered element, return it
    if (isValidElement(icon)) {
      return icon;
    }

    // If it's a component type, render it with fixed styling
    if (isComponentType(icon)) {
      const IconComponent = icon as LucideIcon;
      return <IconComponent className="size-6!" />;
    }

    // Otherwise render as-is
    return icon;
  };

  return (
    <Badge className={cn(tableBadgeVariants({ variant }), className)} {...props}>
      {renderIcon()}
      {text}
    </Badge>
  );
}

interface TableStatusProps extends HTMLAttributes<HTMLDivElement> {
  indicatorColor: string;
  label: string;
}

function TableStatus({ indicatorColor, label, className, ...props }: TableStatusProps) {
  return (
    <div className={cn("flex items-center gap-small", className)} {...props}>
      <span
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: indicatorColor }}
        aria-hidden
      />
      <span className="text-text-color">{label}</span>
    </div>
  );
}
