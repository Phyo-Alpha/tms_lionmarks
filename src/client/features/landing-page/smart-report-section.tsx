import { Button } from "@/client/components/ui/button";
import Link from "next/link";

export const SmartReportSection: React.FC = () => {
  return (
    <section className="py-20 bg-background">
      <main className="container mx-auto px-6">
        <article
          className="relative grid lg:grid-cols-2 items-center p-8 rounded-2xl border-2 border-border"
          style={{
            background:
              "linear-gradient(90deg, var(--accent) 75%, var(--color-secondary-100) 100%)",
          }}
        >
          <header className="space-y-8">
            <h2 className="text-h1 font-bold">Insights You Can Act On</h2>

            <p className="text-body text-foreground leading-relaxed max-w-2xl">
              Our FRBI assessment identifies what&apos;s working, what&apos;s not, and where you
              stand against your peers—so you can make confident decisions and drive measurable
              results.
            </p>

            <footer>
              <Button size="lg" rounded="sm" variant="default" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </footer>
          </header>

          <figure className="hidden lg:block absolute -bottom-8 -right-18 w-full max-w-2xl lg:-top-8 xl:-top-16 lg:right-8 lg:left-auto lg:bottom-auto h-auto z-10">
            <img
              src="/landing-page/device.png"
              alt="Laptop displaying Smart Enabled Report interface"
              className="w-1/5 lg:w-3/5 xl:w-4/5 h-auto ms-auto"
            />
          </figure>
        </article>
      </main>
    </section>
  );
};
