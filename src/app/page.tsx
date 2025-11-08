import { PageHeader } from "@/client/components/layout";
import {
  AboutSection,
  BenefitsSection,
  CompaniesLogoSection,
  FAQSection,
  Footer,
  HeroHeader,
  SmartReportSection,
  TestimonialsSection,
} from "@/client/features/landing-page";

export default function Home() {
  return (
    <main className="min-h-screen">
      <PageHeader />
      <HeroHeader />
      <AboutSection />
      <CompaniesLogoSection />
      <BenefitsSection />
      <TestimonialsSection />
      <FAQSection />
      <SmartReportSection />
      <Footer />
    </main>
  );
}
