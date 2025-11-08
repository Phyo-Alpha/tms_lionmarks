import { Button } from "@/client/components/ui/button";
import { Card, CardContent } from "@/client/components/ui/card";
import Link from "next/link";

export const BenefitsSection: React.FC = () => {
  const stats = [
    {
      value: "92%",
      description:
        "of businesses reported greater alignment across teams after completing the survey.",
    },
    {
      value: "3x",
      description: "faster identification of operational gaps compared to manual assessments.",
    },
    {
      value: "87%",
      description: "of businesses saw measurable improvements within 6 months.",
    },
    {
      value: "60%",
      description: "average reduction in operational costs after utilizing the platform.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <main className="container mx-auto px-6">
        <article className="grid lg:grid-cols-3 gap-12 items-start">
          <header className="space-y-8 col-span-2">
            <aside className="text-md font-bold uppercase tracking-wider text-primary">
              Benefits
            </aside>

            <h2 className="text-h1 font-bold text-primary leading-tight">
              Turn Insights Into
              <br />
              Actionable Strategy
            </h2>

            <p className="text-body text-primary max-w-4xl">
              Our platform helps businesses diagnose performance, benchmark against peers, and
              uncover growth opportunities with AI-powered analysis and intuitive reporting for
              faster, smarter decisions.
            </p>

            <section className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6 bg-card border-border">
                  <CardContent className="p-0">
                    <header className="text-h1 font-bold text-primary mb-2">{stat.value}</header>
                    <p className="text-sm text-primary leading-relaxed">{stat.description}</p>
                  </CardContent>
                </Card>
              ))}
            </section>

            <footer className="pt-4">
              <Button size="xl" rounded="sm" variant="default" asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </footer>
          </header>

          <aside className="relative col-span-1 hidden lg:block">
            <figure className="aspect-9/16 w-full">
              <img
                src="/landing-page/benefits-image.png"
                alt="Business meeting with handshake and data analysis on tablet and documents"
                className="w-full h-full object-cover rounded-lg"
              />
            </figure>
          </aside>
        </article>
      </main>
    </section>
  );
};
