import { ChevronRight } from "lucide-react";
import Link, { LinkProps } from "next/link";

type ChevronArrowLinkProps<R> = LinkProps<R>;
function ChevronArrowLink<R>({ ...props }: ChevronArrowLinkProps<R>) {
  return (
    <Link {...props}>
      <ChevronRight className="size-10 stroke-1" />
    </Link>
  );
}
ChevronArrowLink.displayName = "ChevronArrowLink";

export const Links = {
  Chevron: ChevronArrowLink,
};
