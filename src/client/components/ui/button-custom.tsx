import { cn } from "@/client/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import Image from "next/image";
import * as React from "react";

export type ButtonCustomProps = (
  | (React.ComponentProps<"button"> & { href?: never })
  | (React.ComponentProps<"a"> & { href: string })
) & {
  asChild?: boolean;
  bordered?: boolean;
  logo?: string;
  text?: string;
};

export const ButtonCustom = ({
  ref,
  className,
  children,
  asChild = false,
  bordered = false,
  logo,
  text,
  href,
  ...props
}: ButtonCustomProps) => {
  // Logo variant rendering
  if (logo && text) {
    return (
      <button
        ref={ref as any}
        type="button"
        className={cn(
          "flex items-center justify-center gap-2 bg-card standardRoundness px-6 py-2 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 hover:cursor-pointer hover:opacity-90",
          className,
        )}
        {...(props as any)}
      >
        <Image
          src={logo}
          alt={text}
          width={50}
          height={50}
          className="w-5 aspect-square object-contain"
        />
        <p>{text}</p>
      </button>
    );
  }

  const Comp = asChild ? Slot : href ? "a" : "button";

  const baseClassName = cn(
    // Fixed base styles
    "p rounded-full font-bold transition-all inline-flex items-center justify-center px-7 2.5xl:px-10 cursor-pointer border border-primary text-center",
    // Bordered or filled background
    bordered
      ? "hover:bg-accent hover:shadow-lg hover:scale-[100.5%] py-1 2.5xl:py-2"
      : "bg-primary text-primary-foreground hover:bg-card hover:text-primary hover:shadow-lg py-2 2.5xl:py-2.5",
    className,
  );

  // Handle href for link-style buttons
  if (href && !asChild) {
    return (
      <a ref={ref as any} href={href} className={baseClassName} {...(props as any)}>
        {children}
      </a>
    );
  }

  return (
    <Comp
      ref={ref as any}
      className={baseClassName}
      {...(!asChild ? { type: "button" } : {})}
      {...(props as any)}
    >
      {children}
    </Comp>
  );
};

ButtonCustom.displayName = "ButtonCustom";
