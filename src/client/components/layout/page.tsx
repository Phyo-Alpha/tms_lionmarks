import React, { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/client/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Typography } from "../common/typography";
import { ArrowLeft, ChevronLeft } from "lucide-react";

const PageContainerVariants = cva("min-h-screen mx-auto", {
  variants: {
    variant: {
      default: "px-dashboard-margin py-large",
      landing: "",
      form: "w-4/6 py-large",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface PageProps extends HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof PageContainerVariants>["variant"];
}
function Page({ variant = "default", className, ...props }: PageProps) {
  return <main className={cn(PageContainerVariants({ variant, className }))} {...props} />;
}
Page.displayName = "Page";

const PageHeaderVariants = cva("flex items-end justify-between py-4 pb-large", {
  variants: {
    variant: {
      landing: "bg-background px-6",
      default: "bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const backButtonVariants = cva("text-sm text-muted-foreground underline hover:text-foreground", {
  variants: {
    variant: {
      default: "",
      chevron: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const backButtonIconVariants = cva("", {
  variants: {
    iconSize: {
      default: "size-4",
      chevron: "size-8",
    },
  },
  defaultVariants: {
    iconSize: "default",
  },
});

interface PageHeaderProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof PageHeaderVariants> {
  title?: string;
  description?: string;
  actionButtons?: ReactNode;
  backButton?: {
    variant?: VariantProps<typeof backButtonVariants>["variant"];
    iconSize?: VariantProps<typeof backButtonIconVariants>["iconSize"];
    href?: string;
    onClick?: () => void;
    text?: string;
  };
  children?: ReactNode;
}

function PageHeader({
  variant = "default",
  title,
  description,
  actionButtons,
  backButton,
  children,
  className,
  ...props
}: PageHeaderProps) {
  const Container = variant === "landing" ? "header" : "section";

  const hasStructuredHeader = Boolean(title || description || actionButtons || backButton);

  const BackIcon = backButton?.variant === "chevron" ? ChevronLeft : ArrowLeft;

  return (
    <Container className={cn(PageHeaderVariants({ variant, className }))} {...props}>
      {hasStructuredHeader ? (
        <>
          <div className="flex flex-col gap-1">
            {backButton && (
              <div className="mb-1">
                {backButton.href ? (
                  <a
                    href={backButton.href}
                    className={cn(
                      backButtonVariants({ variant: backButton.variant }),
                      "flex items-center gap-1",
                    )}
                  >
                    <BackIcon
                      className={backButtonIconVariants({ iconSize: backButton.iconSize })}
                    />
                    {backButton.text || "Back"}
                  </a>
                ) : (
                  <button
                    onClick={backButton.onClick}
                    className={cn(
                      backButtonVariants({ variant: backButton.variant }),
                      "flex items-center gap-1",
                    )}
                  >
                    <BackIcon
                      className={backButtonIconVariants({ iconSize: backButton.iconSize })}
                    />
                    {backButton.text || "Back"}
                  </button>
                )}
              </div>
            )}
            {title && <Typography.H1>{title}</Typography.H1>}
            {description && <p className="text-muted-foreground mt-1">{description}</p>}
          </div>
          {actionButtons && <div className="flex items-center gap-3">{actionButtons}</div>}
        </>
      ) : (
        children
      )}
    </Container>
  );
}

const PageBodyVariants = cva("flex flex-col gap-20", {
  variants: {
    variant: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface PageBodyProps extends HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof PageBodyVariants>["variant"];
}
function PageBody({ variant = "default", className, ...props }: PageBodyProps) {
  return <div className={cn(PageBodyVariants({ variant, className }))} {...props} />;
}

export { Page, PageHeader, PageBody };
