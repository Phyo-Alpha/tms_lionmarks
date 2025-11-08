import Link from "next/link";
import { Icon } from "@iconify/react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-background py-12">
      <main className="container mx-auto px-6">
        <section className="flex flex-col md:flex-row items-center justify-between gap-8">
          <section className="flex flex-col items-center md:items-start gap-4">
            <header className="flex items-center gap-2">
              <img src="/landing-page/sbf-logo.png" alt="SBF Logo" className="h-8 w-auto" />
            </header>
            <p className="text-background text-sm">
              © 2025 Singapore Business Federation. All rights reserved.
            </p>
          </section>

          <section className="flex flex-col items-center md:items-end gap-4">
            <nav className="flex items-center gap-4">
              <Link
                href="#"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Icon icon="mdi:facebook" className="size-6" />
              </Link>
              <Link
                href="#"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Icon icon="mdi:instagram" className="size-6" />
              </Link>
              <Link
                href="#"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                aria-label="X (Twitter)"
              >
                <Icon icon="mdi:twitter" className="size-6" />
              </Link>
              <Link
                href="#"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Icon icon="mdi:linkedin" className="size-6" />
              </Link>
              <Link
                href="#"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                aria-label="YouTube"
              >
                <Icon icon="mdi:youtube" className="size-6" />
              </Link>
            </nav>

            <nav className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm underline"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm underline"
              >
                Terms of Use
              </Link>
              <Link
                href="/cookies"
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm underline"
              >
                Cookie Settings
              </Link>
            </nav>
          </section>
        </section>
      </main>
    </footer>
  );
};
