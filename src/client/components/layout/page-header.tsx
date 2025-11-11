import { Button } from "@/client/components/ui/button";
import { cn } from "@/client/lib/utils";
import Link from "next/link";

interface PageHeaderProps {
  logo?: {
    src: string;
    alt: string;
  };
  loginButtonText?: string;
  loginHref?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  logo = { src: "/logo.png", alt: "Lionmarks Logo" },
  loginButtonText = "Login/Sign Up",
  loginHref = "/login",
  className,
}) => {
  return (
    <header className={cn("bg-background px-6 py-4", className)}>
      <nav className="flex items-center justify-between">
        <section className="flex items-center gap-2">
          <img src={logo.src} alt={logo.alt} className="aspect-video object-cover h-26" />
        </section>

        <section>
          <Button variant="default" size="lg" rounded="sm" asChild>
            <Link href={loginHref}>{loginButtonText}</Link>
          </Button>
        </section>
      </nav>
    </header>
  );
};
