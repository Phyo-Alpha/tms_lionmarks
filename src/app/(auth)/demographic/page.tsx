"use client";

import { Form } from "@/client/components/ui/form";
import { TopBar } from "@/client/components/login-register/top-bar";
import { ImageBanner } from "@/client/components/login-register/image-banner";
import { LoginContainer } from "@/client/components/login-register/login-container";
// import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import ConfirmationModal from "@/client/components/login-register/register/confirmation-modal/confirmation-modal";
import { RegistrationFieldsOne } from "@/client/components/login-register/register/registration-wizard/registration-fields-one";
import { RegistrationFieldsTwo } from "@/client/components/login-register/register/registration-wizard/registration-fields-two";
import { RegistrationFieldsThree } from "@/client/components/login-register/register/registration-wizard/registration-fields-three";
import { RegistrationReview } from "@/client/components/login-register/register/registration-wizard/registration-review";
// schemas moved locally below
import { PaginationDots } from "@/client/components/login-register/register/registration-wizard/pagination-dots";
import { NavigationButtons } from "@/client/components/login-register/register/registration-wizard/navigation-buttons";
import { InfoBox } from "@/client/components/login-register/register/infobox";
import { LoginFormSection } from "@/client/components/login-register/login-form-section";

//---------------- HARDCODED VALUES ----------------
const total_registration_sections = 4 as const;

// info box copy
const STAFF_ROLE_INFO_HTML =
  "You selected “Staff-level Employee” for your Role. The individual who creates the account for your organisation should be someone who can delegate tasks to employees. You may ignore this message if tasked to do so on behalf of the organisation you belong to.<br/><br/>Once created, the account owner can invite their team to complete the relevant survey sections.";

// dummy organization details for confirmation pop-up
const organizationName = "CDA Industries";
const email = "adam.leong@cda.com.sg";

// warning box display toggle
const ACCOUNT_REGISTERED = true;

// Title and Description copy for each registation section
const registrationCopy = [
  {
    id: 1,
    title: "Tell us about you and your organization",
    description:
      "To provide you with optimal recommendations and customize your survey, please complete the following information. We will also use your Company’s UEN to obtain publicly available financial data from ACRA to auto-fill certain fields.",
  },
  {
    id: 2,
    title: "Your business story so far",
    description:
      "To provide you with optimal recommendations and customize your survey, please complete the following information. Certain fields have been pre-filled with data from ACRA; you may update any inaccuracies or outdated information as needed.",
  },
  {
    id: 3,
    title: "Your support and growth journey",
    description:
      "We'd like to understand the types of programmes and financial support your business has accessed in recent years. Sharing this information helps us identify the level of assistance your organisation receives and recommend initiatives that can further strengthen your growth.",
  },
  {
    id: 4,
    title: "Almost there — let's review your details",
    description: "",
  },
];

// Local schema and step fields (moved from registration-schemas.ts)
export const registrationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  organizationName: z.string().optional(),
  uen: z.string().min(1, "Organisation UEN is required"),
  turnover: z.string().optional(),
  yearsInOperation: z.string().optional(),
  supportPrograms: z.string().optional(),
  bankingSupport: z.string().optional(),
});

export type DemographicFormValues = z.infer<typeof registrationFormSchema>;

const section1Fields: Array<keyof DemographicFormValues> = ["name", "role", "uen"];
const section2Fields: Array<keyof DemographicFormValues> = ["turnover", "yearsInOperation"];
const section3Fields: Array<keyof DemographicFormValues> = ["supportPrograms", "bankingSupport"];

//---------------- END HARDCODED VALUES ----------------

export default function DemographicPage() {
  // const router = useRouter(); // reserved for final submission navigation
  const form = useForm<DemographicFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      name: "",
      role: "",
      organizationName: organizationName,
      uen: "",
      turnover: "",
      yearsInOperation: "",
      supportPrograms: "",
      bankingSupport: "",
    },
  });

  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [activeFields, setActiveFields] = React.useState(0);

  const onSubmit = () => {
    setIsConfirmOpen(true);
  };

  const validateSection = async (sectionIndex: number) => {
    const fields =
      sectionIndex === 0 ? section1Fields : sectionIndex === 1 ? section2Fields : section3Fields;
    if (fields.length === 0) return true;
    return form.trigger(fields as any, { shouldFocus: true });
  };

  const handleNext = async () => {
    const valid = await validateSection(activeFields);
    if (!valid) return;
    if (activeFields === 0) {
      setIsConfirmOpen(true);
      return;
    }
    setActiveFields((s) => Math.min(s + 1, total_registration_sections - 1));
  };

  const handleBack = () => {
    setActiveFields((s) => Math.max(s - 1, 0));
  };

  return (
    <main className="h-screen flex w-full">
      <div className="w-full h-full flex flex-col">
        <TopBar />
        <div className="flex flex-row flex-1 overflow-hidden">
          {/* LEFT - DEMOGRAPHIC SECTION */}
          <LoginFormSection className="bg-sbf-off-white">
            <LoginContainer className="h-full overflow-auto py-12 2.5xl:py-16">
              <div className="flex flex-col h-full 4xl:px-0 4xl:max-w-[60rem] 4xl:mx-auto">
                <div className="flex flex-1 ">
                  <div className="flex flex-col space-y-6 2.5xl:space-y-8 w-full mb-12 2.5xl:mb-16">
                    {/* PAGINATION DOTS */}
                    <PaginationDots total={total_registration_sections} active={activeFields} />
                    <h1 className="text-2xl font-bold">{registrationCopy[activeFields].title}</h1>

                    {registrationCopy[activeFields].description && (
                      <p className="">{registrationCopy[activeFields].description}</p>
                    )}

                    <div
                      className={
                        activeFields === 2 || activeFields === 3
                          ? "mt-6"
                          : "mt-6 xl:mt-10 2xl:mt-14"
                      }
                    >
                      {/* FORM */}
                      <Form {...form}>
                        <form
                          onSubmit={form.handleSubmit(onSubmit)}
                          className="flex w-full flex-col space-y-6"
                        >
                          {activeFields === 0 ? (
                            <RegistrationFieldsOne />
                          ) : activeFields === 1 ? (
                            <RegistrationFieldsTwo />
                          ) : activeFields === 2 ? (
                            <RegistrationFieldsThree />
                          ) : (
                            <RegistrationReview />
                          )}

                          {/* NAVIGATION BUTTONS */}
                          <div className="flex items-center justify-between">
                            <NavigationButtons
                              onBack={handleBack}
                              onNext={handleNext}
                              showBack={activeFields > 0}
                              nextButtonText={
                                activeFields === total_registration_sections - 1
                                  ? "Confirm Details"
                                  : "Next"
                              }
                            />
                          </div>

                          {/* WARNING BOX */}
                          {activeFields === 0 && ACCOUNT_REGISTERED && (
                            <InfoBox
                              variant="warning"
                              className="w-full mx-0"
                              organizationName={organizationName}
                              uen={form.getValues("uen")}
                              email={email}
                            />
                          )}

                          {/* INFO BOX */}
                          {activeFields === 0 && form.watch("role") === "staff" && (
                            <InfoBox className="w-full mx-0">{STAFF_ROLE_INFO_HTML}</InfoBox>
                          )}
                        </form>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </LoginContainer>
          </LoginFormSection>

          <ImageBanner />
        </div>
      </div>

      <ConfirmationModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        organizationName={organizationName}
        uen={form.getValues("uen")}
        onEdit={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          setActiveFields(1);
        }}
      />
    </main>
  );
}
