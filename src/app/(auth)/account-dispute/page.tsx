"use client";

import { Form } from "@/client/components/ui/form";
import { TopBar } from "@/client/components/login-register/top-bar";
import { ImageBanner } from "@/client/components/login-register/image-banner";
import { LoginContainer } from "@/client/components/login-register/login-container";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { FormInput } from "@/client/components/ui/form/form-input";
import FormSelect from "@/client/components/ui/form/form-select";
import { FormTextarea } from "@/client/components/ui/form/form-textarea";
import { ButtonCustom } from "@/client/components/ui/button-custom";
import { LoginFormSection } from "@/client/components/login-register/login-form-section";

//---------------- HARDCODED VALUES ----------------
const DISPUTE_REASON_OPTIONS = [
  { label: "The UEN does not match the name of my organisation  ", value: "name_mismatch" },
  { label: "This email does not belong to our organisation", value: "email_mismatch" },
  { label: "This organisation was registered incorrectly", value: "incorrect_registration" },
  { label: "Other", value: "other" },
] as const;

// page content
const DISPUTE_PAGE_TITLE = "Account Dispute";
const DISPUTE_PAGE_DESCRIPTION =
  "It seems that you are trying to register an FRBI account for an Organisation that already has one. If this is a mistake, kindly fill in the details and we'll reach out to resolve this issue.";
const SUBMIT_BUTTON_TEXT = "Submit";

// form schema
const disputeFormSchema = z.object({
  organizationName: z.string().min(1, "Name of Organisation is required"),
  uen: z.string().min(1, "Organisation UEN is required"),
  yourName: z.string().min(1, "Your Name is required"),
  yourEmail: z.string().email("Please enter a valid email address"),
  reasonForDispute: z.string().min(1, "Reason for Dispute is required"),
  additionalDetails: z.string().optional(),
});

export type DisputeFormValues = z.infer<typeof disputeFormSchema>;
//---------------- END HARDCODED VALUES ----------------

export default function AccountDisputePage() {
  const form = useForm<DisputeFormValues>({
    resolver: zodResolver(disputeFormSchema),
    defaultValues: {
      organizationName: "",
      uen: "",
      yourName: "",
      yourEmail: "",
      reasonForDispute: "",
      additionalDetails: "",
    },
  });

  const onSubmit = (data: DisputeFormValues) => {
    console.log("Dispute form submitted:", data);
    // TODO: Handle form submission
  };

  return (
    <main className="h-screen flex w-full">
      <div className="w-full h-full flex flex-col">
        <TopBar />
        <div className="flex flex-row flex-1 overflow-hidden">
          {/* LEFT - DISPUTE SECTION */}
          <LoginFormSection className="bg-sbf-off-white py-12 2.5xl:py-16 h-full overflow-auto">
            <LoginContainer className="flex flex-col h-full ">
              <div className="flex flex-1">
                <div className="flex flex-col space-y-6 2.5xl:space-y-8 w-full mb-12 2.5xl:mb-16">
                  <h1 className=" font-bold">{DISPUTE_PAGE_TITLE}</h1>
                  <p className="">{DISPUTE_PAGE_DESCRIPTION}</p>

                  <div className="">
                    {/* FORM */}
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex w-full flex-col space-y-6"
                      >
                        <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-5">
                          <FormInput
                            name="organizationName"
                            label="Name of Organisation"
                            placeholder="CDA Industries"
                            InputProps={{ inputSize: "default" }}
                            className="sm:w-1/2"
                          />

                          <FormInput
                            name="uen"
                            label="Organisation UEN"
                            placeholder="202012345K"
                            InputProps={{ inputSize: "default" }}
                            className="sm:w-1/2"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-5">
                          <FormInput
                            name="yourName"
                            label="Your Name"
                            placeholder="Alex Chong"
                            InputProps={{ inputSize: "default" }}
                            className="sm:w-1/2"
                          />

                          <FormInput
                            name="yourEmail"
                            label="Your Email"
                            placeholder="alex.chong@cda.com.sg"
                            type="email"
                            InputProps={{ inputSize: "default" }}
                            className="sm:w-1/2"
                          />
                        </div>

                        <FormSelect
                          name="reasonForDispute"
                          label="Reason for Dispute"
                          items={
                            DISPUTE_REASON_OPTIONS as unknown as {
                              label: string;
                              value: string;
                            }[]
                          }
                        />

                        <FormTextarea
                          name="additionalDetails"
                          label="(Optional) Additional Details"
                        />

                        <div className="flex justify-end">
                          <ButtonCustom type="submit" className="w-fit px-6 font-bold">
                            {SUBMIT_BUTTON_TEXT}
                          </ButtonCustom>
                        </div>
                      </form>
                    </Form>
                  </div>
                </div>
              </div>
            </LoginContainer>
          </LoginFormSection>

          <ImageBanner />
        </div>
      </div>
    </main>
  );
}
