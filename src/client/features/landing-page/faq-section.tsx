"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState(0);

  // TODO: change later to the actual FAQs
  const faqs = [
    {
      question: "What is the platform?",
      answer:
        "Our platform is designed to help organizations assess their internal strengths and weaknesses. It provides benchmarking against peers and strategic insights for improvement. This empowers businesses to make informed decisions and enhance their market standing.",
    },
    {
      question: "How does it work?",
      answer:
        "The platform uses a comprehensive survey system to evaluate your organization across multiple dimensions. Our AI-powered analysis provides detailed insights and recommendations to help you improve your business performance.",
    },
    {
      question: "Is my data safe?",
      answer:
        "Yes, we take data security very seriously. All data is encrypted and stored securely. We follow industry best practices and comply with relevant data protection regulations to ensure your information is safe.",
    },
    {
      question: "Who can use it?",
      answer:
        "Our platform is designed for business leaders, strategists, and consultants who want to future-proof their organizations. It's suitable for companies of all sizes looking to assess and improve their future readiness.",
    },
    {
      question: "How do I start?",
      answer:
        "Getting started is easy! Simply register for an account, complete the assessment survey, and receive your personalized report with actionable insights and recommendations.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 bg-background">
      <main className="container mx-auto px-6">
        <article className="grid lg:grid-cols-3 gap-12 items-start">
          <header className="space-y-6 col-span-1">
            <h1 className="text-h1 font-bold text-primary">FAQs</h1>
            <p className="text-body max-w-3xl">
              Find answers to common questions about our <br /> survey platform and its benefits.
            </p>
          </header>

          <aside className="space-y-0 col-span-2">
            {faqs.map((faq, index) => (
              <section key={index} className="border-b border-border last:border-b-0">
                <button
                  className="w-full flex items-center justify-between py-6 text-left"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                >
                  <h3 className="text-h3 font-bold pr-4">{faq.question}</h3>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 shrink-0" />
                  )}
                </button>

                {openIndex === index && (
                  <article className="pb-6">
                    <p className="text-body leading-relaxed pl-0">{faq.answer}</p>
                  </article>
                )}
              </section>
            ))}
          </aside>
        </article>
      </main>
    </section>
  );
};
