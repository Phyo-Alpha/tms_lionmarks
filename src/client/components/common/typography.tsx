import { cn } from "@/client/lib/utils";
import { HTMLAttributes } from "react";

type HeadingProps = HTMLAttributes<HTMLHeadingElement>;

type H1Props = HeadingProps;
function H1({ className, children, ...props }: H1Props) {
  return (
    <h1 className={cn("text-h1 font-bold", className)} {...props}>
      {children}
    </h1>
  );
}

type H2Props = HeadingProps;
function H2({ className, children, ...props }: H2Props) {
  return (
    <h2 className={cn("text-h2 font-bold", className)} {...props}>
      {children}
    </h2>
  );
}

type H3Props = HeadingProps;
function H3({ className, children, ...props }: H3Props) {
  return (
    <h3 className={cn("text-h3 font-bold", className)} {...props}>
      {children}
    </h3>
  );
}

type PProps = HTMLAttributes<HTMLParagraphElement>;
function P({ className, children, ...props }: PProps) {
  return (
    <p className={cn("text-body font-body", className)} {...props}>
      {children}
    </p>
  );
}
type PLargeProps = PProps;
function PLarge({ className, children, ...props }: PLargeProps) {
  return (
    <p className={cn("text-h1 font-bold", className)} {...props}>
      {children}
    </p>
  );
}
type PHeadLineProps = PProps;
function PHeadLine({ className, children, ...props }: PHeadLineProps) {
  return (
    <p className={cn("text-h1", className)} {...props}>
      {children}
    </p>
  );
}
const Typography = {
  H1,
  H2,
  H3,
  P,
  Headline: PHeadLine,
  PLarge,
};

export { Typography };
