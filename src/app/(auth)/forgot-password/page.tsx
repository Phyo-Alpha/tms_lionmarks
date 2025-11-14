"use client";

import { FormContainer } from "@/client/components/login-register/form-container";
import { ImageBanner } from "@/client/components/login-register/image-banner";
import { LoginContainer } from "@/client/components/login-register/login-container";
import { LoginFormSection } from "@/client/components/login-register/login-form-section";
import { LogoTitleDescription } from "@/client/components/login-register/logo-title-description";
import { TopBar } from "@/client/components/login-register/top-bar";
import { ButtonCustom } from "@/client/components/ui/button-custom";
import { Form } from "@/client/components/ui/form";
import { FormInput } from "@/client/components/ui/form/form-input";
import { authQueries } from "@/client/services/auth";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [userEmail] = useQueryState("email", parseAsString.withDefault(""));
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: userEmail,
    },
  });

  const forgotPasswordMutation = useMutation(authQueries.forgotPassword());

  const handleSubmit = async (data: { email: string }) => {
    await forgotPasswordMutation
      .mutateAsync(
        { email: data.email },
        {
          onSuccess: () => {
            setEmailSent(true);
          },
        },
      )
      .catch((error) => {
        toast.error(error.message || "Failed to send reset email");
      });
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <main className="h-screen flex w-full">
      <div className="w-full h-full flex flex-col">
        <TopBar />

        <div className="flex flex-row flex-1 overflow-hidden">
          <LoginFormSection className="bg-background">
            <LoginContainer className="flex flex-col h-full pb-24">
              <div className="flex flex-1 ">
                <div className="flex flex-col space-y-6 my-auto w-full">
                  <LogoTitleDescription
                    title={emailSent ? "Check Your Inbox" : "Forgot Password?"}
                    description={
                      emailSent
                        ? "We've sent a password reset link to the email <br/> address below that you can use to create a new password."
                        : "Enter your email address and we'll send you a link <br/> to reset your password."
                    }
                    mobileDescription={
                      emailSent
                        ? "We've sent a password reset link to the email address below that you can use to create a new password."
                        : "Enter your email address and we'll send you a link to reset your password."
                    }
                  />

                  <FormContainer>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex w-full flex-col space-y-6 2.5xl:space-y-8"
                      >
                        <FormInput
                          name="email"
                          InputProps={{
                            inputSize: "default",
                            disabled: emailSent,
                          }}
                          label="Email Address"
                          placeholder="Enter your email"
                        />

                        {emailSent ? (
                          <ButtonCustom
                            className="w-full"
                            onClick={handleBackToLogin}
                            type="button"
                          >
                            Back to Login Page
                          </ButtonCustom>
                        ) : (
                          <ButtonCustom
                            className="w-full"
                            type="submit"
                            disabled={forgotPasswordMutation.isPending}
                          >
                            {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
                          </ButtonCustom>
                        )}
                      </form>
                    </Form>
                  </FormContainer>
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
