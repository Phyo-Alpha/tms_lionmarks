"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, HelpCircle } from "lucide-react";
import {
  publicRegistrationQueries,
  publicCourseQueries,
  type PublicRegistrationInput,
} from "@/client/services/public-registration";
import { Form } from "@/client/components/ui/form";
import { Button } from "@/client/components/ui/button";
import { Progress } from "@/client/components/ui/progress";
import { Step1PersonalInfo } from "./steps/step-1-personal-info";
import { Step2AdditionalInfo } from "./steps/step-2-additional-info";
import { Step3CourseSelection } from "./steps/step-3-course-selection";
import { Step4FinalDetails } from "./steps/step-4-final-details";
import { Step5Confirmation } from "./steps/step-5-confirmation";

const registrationSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.email("Invalid email address"),
  phone: z.string().min(3).max(30),
  countryCode: z.string().min(1, "Country code is required"),
  dob: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  address: z.string().min(1, "Home address is required"),
  qualification: z.string().optional(),
  englishCompetency: z.string().optional(),
  vaccinated: z.enum(["Yes", "No"]).optional(),
  courseId: z.string().uuid("Invalid course selected"),
  classStartDate: z.string().optional(),
  salesperson: z.string().optional(),
  hearAboutUs: z.string().optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;
export const useRegistrationForm = () => {
  return useFormContext<RegistrationFormData>();
};

const TOTAL_STEPS = 4;

export function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registration, setRegistration] = useState<PublicRegistrationInput | null>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    mode: "onChange",
    defaultValues: {
      countryCode: "SG +65",
      englishCompetency: "Competent",
      qualification: "Primary",
      vaccinated: "Yes",
      hearAboutUs: "Google Search",
    },
  });

  const coursesQuery = useQuery(publicCourseQueries.list(true));
  const courses = coursesQuery.data?.data ?? [];

  const registrationMutation = useMutation(publicRegistrationQueries.register());

  const progressPercentage = Math.round((currentStep / TOTAL_STEPS) * 100);

  const scrollToStep = (step: number) => {
    const element = stepRefs.current[step - 1];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const nextStep = () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    form.trigger(fieldsToValidate as any).then((isValid) => {
      if (isValid) {
        const next = currentStep + 1;
        setCurrentStep(next);
        setTimeout(() => scrollToStep(next), 100);
      } else {
        toast.error("Please fill in all required fields correctly");
      }
    });
  };

  const prevStep = () => {
    const prev = currentStep - 1;
    setCurrentStep(prev);
    setTimeout(() => scrollToStep(prev), 100);
  };

  const onSubmit = async (data: RegistrationFormData) => {
    const payload: PublicRegistrationInput = {
      ...data,
      dob: new Date(data.dob),
      classStartDate: data.classStartDate ? new Date(data.classStartDate) : undefined,
    };

    await registrationMutation
      .mutateAsync(payload, {
        onSuccess: () => {
          setIsSubmitted(true);
          setCurrentStep(5);
          setTimeout(() => scrollToStep(5), 100);
          toast.success("Registration successful! We will contact you shortly.");
          setRegistration(payload);
        },
      })
      .catch((error) => {
        toast.error(error.message ?? "Failed to submit registration");
      });
  };

  useEffect(() => {
    if (currentStep <= TOTAL_STEPS) {
      scrollToStep(currentStep);
    }
  }, [currentStep]);

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div
          ref={(el) => {
            stepRefs.current[4] = el;
          }}
        >
          <Step5Confirmation registration={registration} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-gray-900">LionMarks</div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-gray-600">
                EN
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <HelpCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        <div className="max-w-4xl mx-auto">
          <Form {...form}>
            <form
              id="registration-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (currentStep === TOTAL_STEPS) {
                  form.handleSubmit(onSubmit)(e);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && currentStep < TOTAL_STEPS) {
                  e.preventDefault();
                  nextStep();
                } else if (e.key === "Enter" && currentStep === TOTAL_STEPS) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
              className="relative min-h-[600px]"
            >
              <div
                ref={(el) => {
                  if (el) {
                    stepRefs.current[0] = el;
                  }
                }}
                className={`transition-all duration-500 ${
                  currentStep === 1
                    ? "opacity-100 translate-y-0 relative z-10"
                    : "opacity-0 -translate-y-4 pointer-events-none absolute inset-0"
                }`}
              >
                <Step1PersonalInfo />
              </div>

              <div
                ref={(el) => {
                  if (el) {
                    stepRefs.current[1] = el;
                  }
                }}
                className={`transition-all duration-500 ${
                  currentStep === 2
                    ? "opacity-100 translate-y-0 relative z-10"
                    : "opacity-0 -translate-y-4 pointer-events-none absolute inset-0"
                }`}
              >
                <Step2AdditionalInfo />
              </div>

              <div
                ref={(el) => {
                  if (el) {
                    stepRefs.current[2] = el;
                  }
                }}
                className={`transition-all duration-500 ${
                  currentStep === 3
                    ? "opacity-100 translate-y-0 relative z-10"
                    : "opacity-0 -translate-y-4 pointer-events-none absolute inset-0"
                }`}
              >
                <Step3CourseSelection courses={courses} isLoading={coursesQuery.isLoading} />
              </div>

              <div
                ref={(el) => {
                  if (el) {
                    stepRefs.current[3] = el;
                  }
                }}
                className={`transition-all duration-500 ${
                  currentStep === 4
                    ? "opacity-100 translate-y-0 relative z-10"
                    : "opacity-0 -translate-y-4 pointer-events-none absolute inset-0"
                }`}
              >
                <Step4FinalDetails />
              </div>
            </form>
          </Form>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Progress on Left */}
            <div className="flex items-center gap-4 min-w-[120px]">
              <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
              <Progress value={progressPercentage} className="w-32 h-2" />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-4">
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={prevStep} className="gap-2 px-6">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              {currentStep < TOTAL_STEPS ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="gap-2 px-6 bg-primary hover:bg-primary/80 text-white"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    form.handleSubmit(onSubmit)(e);
                  }}
                  disabled={registrationMutation.isPending}
                  className="gap-2 px-6 bg-primary hover:bg-primary/80 text-white"
                >
                  {registrationMutation.isPending ? "Submitting..." : "Submit Registration"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Help Button */}
            <div className="min-w-[120px] flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-primary hover:text-primary/80 hover:bg-primary/10"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Help</span>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function getFieldsForStep(step: number): (keyof RegistrationFormData)[] {
  const fields: Record<number, (keyof RegistrationFormData)[]> = {
    1: ["firstName", "lastName", "email", "phone", "countryCode", "dob", "nationality", "address"],
    2: ["qualification", "englishCompetency", "vaccinated"],
    3: ["courseId"],
    4: ["classStartDate", "salesperson", "hearAboutUs"],
  };
  return fields[step] ?? [];
}
