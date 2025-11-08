import { Button } from "@/client/components/ui/button";
import Link from "next/link";

export const HeroHeader: React.FC = () => {
  return (
    <section className="relative min-h-[600px] flex items-center">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/landing-page/hero-banner.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-linear-to-r from-foreground/50 to-transparent" />
      </div>

      <main className="relative z-10 container mx-auto px-6 py-20">
        <header className="max-w-3xl">
          <h1 className="text-h1 font-bold text-primary-foreground mb-6">
            Position Your Business Ahead <br /> of the Curve with FRBI
          </h1>

          <p className="text-body text-primary-foreground/90 mb-8 max-w-2xl">
            Gain a clear view of your strengths and gaps with a structured survey and AI-powered
            analysis —trusted by forward-thinking enterprises.
          </p>

          <Button size="xl" rounded="sm" variant="default" asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </header>
      </main>
    </section>
  );
};
