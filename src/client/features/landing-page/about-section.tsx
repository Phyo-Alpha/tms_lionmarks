export const AboutSection: React.FC = () => {
  const sections = [
    {
      title: "WHAT IS FRBI?",
      description:
        "The Future Ready Business Index (FRBI) is a strategic assessment tool that measures how prepared your business is for the future across six critical dimensions.",
    },
    {
      title: "WHY IT MATTERS",
      description:
        "FRBI helps you identify gaps, benchmark performance, and uncover opportunities to drive sustainable growth, innovation, and resilience.",
    },
    {
      title: "WHO IT'S FOR",
      description:
        "FRBI is built for business leaders, strategists, and consultants who want to future-proof their organizations in a rapidly changing world.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <main className="container mx-auto px-6">
        <article className="grid lg:grid-cols-2 gap-12 items-start">
          <header className="space-y-6">
            <h2 className="text-h1 font-bold text-foreground">
              Empowering
              <br />
              Businesses with
              <br />
              our Future Ready
              <br />
              Business Index (FRBI)
            </h2>
          </header>

          <aside className="space-y-8">
            {sections.map((section, index) => (
              <section key={index} className="space-y-3">
                <h3 className="text-h4 font-extrabold uppercase text-primary">{section.title}</h3>
                <p className="text-body text-foreground">{section.description}</p>
              </section>
            ))}
          </aside>
        </article>
      </main>
    </section>
  );
};
