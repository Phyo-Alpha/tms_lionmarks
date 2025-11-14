"use client";

import { FormContainer } from "@/client/components/login-register/form-container";
import { ImageBanner } from "@/client/components/login-register/image-banner";
import { LoginContainer } from "@/client/components/login-register/login-container";
import { LoginFormSection } from "@/client/components/login-register/login-form-section";
import { LogoTitleDescription } from "@/client/components/login-register/logo-title-description";
import { TopBar } from "@/client/components/login-register/top-bar";
import { Form } from "@/client/components/ui/form";
import { FormInput } from "@/client/components/ui/form/form-input";
import { FormSubmit } from "@/client/components/ui/form/form-submit";
import { authQueries } from "@/client/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const CONTENT = {
  title: "Welcome to Lionmarks TMS Platform.",
  mobileTitle: "Welcome to Lionmarks TMS Platform.",
  description: "Please login to your account to continue.",
  submitButtonText: "Log In",
  submitButtonLoadingText: "Signing in...",
};

const emailCheckSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

export default function LoginPage() {
  const router = useRouter();
  const [emailFromParams] = useQueryState("email", parseAsString.withDefault(""));
  const emailForm = useForm<z.infer<typeof emailCheckSchema>>({
    resolver: zodResolver(emailCheckSchema),
    defaultValues: { email: emailFromParams },
  });

  const checkUserExists = useMutation(authQueries.checkUserExists());

  const onEmailSubmit = async (data: z.infer<typeof emailCheckSchema>) => {
    await checkUserExists
      .mutateAsync(
        { email: data.email },
        {
          onSuccess: (response) => {
            if (response.exists) {
              router.push(`/login/password?email=${encodeURIComponent(data.email)}`);
            } else {
              router.push(`/register?email=${encodeURIComponent(data.email)}`);
            }
          },
        },
      )
      .catch((error) => {
        toast.error(error.message ?? "Unable to verify email. Please try again.");
      });
  };

  return (
    <main className="h-screen flex w-full">
      <div className="w-full h-full flex flex-col">
        <TopBar variant="user" />

        <div className="flex flex-row flex-1 overflow-hidden">
          <LoginFormSection className="bg-background">
            <LoginContainer className="flex flex-col h-full overflow-y-auto py-10 ">
              <div className="flex flex-1 ">
                <div className="flex flex-col space-y-6 my-auto w-full">
                  <LogoTitleDescription
                    title={CONTENT.title}
                    mobileTitle={CONTENT.mobileTitle}
                    description={CONTENT.description}
                  />

                  <Form {...emailForm}>
                    <FormContainer as="form" onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
                      <FormInput
                        name="email"
                        InputProps={{ inputSize: "default" }}
                        label="Email Address"
                        placeholder="Enter your email"
                      />

                      <FormSubmit
                        className="w-full p font-bold"
                        disabled={checkUserExists.isPending}
                      >
                        {checkUserExists.isPending
                          ? CONTENT.submitButtonLoadingText
                          : CONTENT.submitButtonText}
                      </FormSubmit>
                    </FormContainer>
                  </Form>
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
