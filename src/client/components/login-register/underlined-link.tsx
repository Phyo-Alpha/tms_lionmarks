import Link from "next/link";
import { cn } from "@/client/lib/utils";

interface UnderlinedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const UnderlinedLink = ({ href, children, className, onClick }: UnderlinedLinkProps) => {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onClick();
        }}
        className={cn(
          "border-b border-black w-fit p text-primary hover:cursor-pointer",
          className,
        )}
      >
        {children}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "border-b border-black w-fit p text-primary hover:cursor-pointer",
        className,
      )}
    >
      {children}
    </Link>
  );
};
