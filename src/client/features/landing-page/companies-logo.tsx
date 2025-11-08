// Company logos for the logo loop
const companyLogos = [
  {
    src: "/landing-page/company-logo-1.png",
    alt: "Singapore Accountants",
    href: "https://singaporeaccountants.com",
  },
  {
    src: "/landing-page/company-logo-2.png",
    alt: "Singapore Bank",
    href: "https://singaporebank.com",
  },
  {
    src: "/landing-page/company-logo-1.png",
    alt: "Tech Solutions Inc",
    href: "https://techsolutions.com",
  },
  {
    src: "/landing-page/company-logo-2.png",
    alt: "Innovation Corp",
    href: "https://innovationcorp.com",
  },
  {
    src: "/landing-page/company-logo-1.png",
    alt: "Global Partners",
    href: "https://globalpartners.com",
  },
];

export const CompaniesLogoSection: React.FC = () => {
  return (
    <section className="py-16 bg-card">
      <header className="text-center mb-8 container mx-auto px-6">
        <h2 className="text-h3 font-semibold text-foreground mb-4">
          Trusted by top companies across various industries
        </h2>
      </header>
      <aside className="relative overflow-hidden w-full" style={{ height: 120 }}>
        {/* <LogoLoop
          logos={companyLogos}
          speed={120}
          direction="left"
          logoHeight={64}
          gap={40}
          pauseOnHover
          scaleOnHover
        /> */}
      </aside>
    </section>
  );
};
