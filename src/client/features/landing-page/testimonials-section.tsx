"use client";
import { Card, CardContent } from "@/client/components/ui/card";
import { Button } from "@/client/components/ui/button";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/client/hooks/use-mobile";

export const TestimonialsSection: React.FC = () => {
  // TODO: see if there's a better way to handle the testimonials data
  // TODO: add more logic that fetch latest testimonials and only have 3 slides in total
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useIsMobile();
  const testimonials = [
    {
      companyLogo: {
        src: "/landing-page/company-logo-1.png",
        alt: "Singapore Accountants",
      },
      quote:
        "The insights we gained from this platform transformed our strategic approach and boosted our market performance.",
      name: "John Doe",
      title: "CEO, Tech Innovations",
      avatar: "/landing-page/image-placeholder.jpg",
    },
    {
      companyLogo: {
        src: "/landing-page/company-logo-2.png",
        alt: "Singapore Bank",
      },
      quote:
        "This survey platform provided us with invaluable benchmarking data that helped us identify key areas for growth.",
      name: "Jane Smith",
      title: "Director, Market Insights",
      avatar: "/landing-page/image-placeholder.jpg",
    },
    {
      companyLogo: {
        src: "/landing-page/company-logo-1.png",
        alt: "Singapore Accountants",
      },
      quote:
        "This survey platform provided us with invaluable benchmarking data that helped us identify key areas for growth.",
      name: "Jane Smith",
      title: "Director, Market Insights",
      avatar: "/landing-page/image-placeholder.jpg",
    },
    {
      companyLogo: {
        src: "/landing-page/company-logo-2.png",
        alt: "Singapore Accountants",
      },
      quote:
        "This survey platform provided us with invaluable benchmarking data that helped us identify key areas for growth.",
      name: "Jane Smith",
      title: "Director, Market Insights",
      avatar: "/landing-page/image-placeholder.jpg",
    },
  ];

  const cardsPerSlide = isMobile ? 2 : 2.5;
  const totalSlides = Math.ceil(testimonials.length / cardsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <section className="py-20 bg-card">
      <main className="container mx-auto px-6">
        <article className="overflow-hidden">
          {isMobile ? (
            <section
              className="flex gap-6 transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(calc(-${currentSlide * 100}% - ${currentSlide * 24}px))`,
              }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="flex flex-col gap-6 shrink-0 w-full">
                  {testimonials
                    .slice(slideIndex * 2, slideIndex * 2 + 2)
                    .map((testimonial, index) => (
                      <Card key={index} className="p-6 bg-card border-border">
                        <CardContent className="p-0 space-y-10">
                          <header className="flex justify-start">
                            <img
                              src={testimonial.companyLogo.src}
                              alt={testimonial.companyLogo.alt}
                              className="h-10 w-auto"
                            />
                          </header>

                          <blockquote className="text-h3 font-bold text-foreground leading-relaxed text-left relative">
                            &quot;{testimonial.quote}&quot;
                          </blockquote>

                          <footer className="flex flex-col items-start space-y-2">
                            <figure className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                              <img
                                src={testimonial.avatar}
                                alt={`${testimonial.name} avatar`}
                                className="w-full h-full object-cover"
                              />
                            </figure>
                            <div className="text-left">
                              <h3 className="text-sm font-bold text-foreground">
                                {testimonial.name}
                              </h3>
                              <p className="text-sm text-primary">{testimonial.title}</p>
                            </div>
                          </footer>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ))}
            </section>
          ) : (
            // Desktop view
            <section
              className="flex gap-6 transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * (100 / 2.9)}%)`,
                width: `${(testimonials.length / 2.9) * 100}%`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="p-6 bg-card border-border shrink-0"
                  style={{ width: `${100 / testimonials.length}%` }}
                >
                  <CardContent className="p-0 space-y-10">
                    <header className="flex justify-start">
                      <img
                        src={testimonial.companyLogo.src}
                        alt={testimonial.companyLogo.alt}
                        className="h-10 w-auto"
                      />
                    </header>

                    <blockquote className="text-h3 font-bold text-foreground leading-relaxed text-left relative">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>

                    <footer className="flex flex-col items-start space-y-2">
                      <figure className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                        <img
                          src={testimonial.avatar}
                          alt={`${testimonial.name} avatar`}
                          className="w-full h-full object-cover"
                        />
                      </figure>
                      <div className="text-left">
                        <h3 className="text-sm font-bold text-foreground">{testimonial.name}</h3>
                        <p className="text-sm text-primary">{testimonial.title}</p>
                      </div>
                    </footer>
                  </CardContent>
                </Card>
              ))}
            </section>
          )}
        </article>

        <nav className="flex items-center justify-end space-x-4 mt-8">
          <Button variant="default" size="icon" rounded="sm" onClick={prevSlide}>
            <ArrowLeft />
          </Button>

          <section className="flex space-x-2">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentSlide ? "bg-primary" : "bg-muted-foreground/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </section>

          <Button variant="default" size="icon" rounded="sm" onClick={nextSlide}>
            <ArrowRight />
          </Button>
        </nav>
      </main>
    </section>
  );
};
