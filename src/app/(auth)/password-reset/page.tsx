"use client";

import { FormContainer } from "@/client/components/login-register/form-container";
import { ImageBanner } from "@/client/components/login-register/image-banner";
import { LoginFormSection } from "@/client/components/login-register/login-form-section";
import { LogoTitleDescription } from "@/client/components/login-register/logo-title-description";
import { TopBar } from "@/client/components/login-register/top-bar";
import { UnderlinedLink } from "@/client/components/login-register/underlined-link";
import { Form } from "@/client/components/ui/form";
import { FormPasswordInput } from "@/client/components/ui/form/form-password-input";
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
  main: {
    title: "Reset Your FRBI Portal Password",
    description: "You're one step away from resetting your password.",
    submitButtonText: "Reset Password",
    submitButtonLoadingText: "Resetting...",
    backToLoginText: "Back to Login Page",
    backToLoginLink: "/login",
  },
};

// Password reset schema
const passwordResetSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function PasswordResetPage() {
  const form = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
  });
  const passwordResetMutation = useMutation(authQueries.passwordReset());
  const [token] = useQueryState("token", parseAsString.withDefault(""));
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof passwordResetSchema>) => {
    await passwordResetMutation
      .mutateAsync(
        { token, password: data.password },
        {
          onSuccess: () => {
            toast.success("Password reset successfully! Redirecting to login...");
            router.push("/login");
          },
        },
      )
      .catch((error) => {
        toast.error(error.message || "Failed to reset password");
      });
  };

  return (
    <main className="h-screen flex w-full">
      <div className="w-full h-full flex flex-col">
        {/* TOP BAR */}
        <TopBar />

        <div className="flex flex-row flex-1 overflow-hidden">
          {/* LEFT - LOGIN SECTION */}
          <LoginFormSection className="bg-sbf-off-white">
            <div className="flex flex-col h-full px-10 5xl:px-0 5xl:max-w-[56.25rem] 5xl:mx-auto">
              <div className="flex flex-1">
                <div className="flex flex-col space-y-6 my-auto w-full">
                  <LogoTitleDescription
                    title={CONTENT.main.title}
                    description={CONTENT.main.description}
                  />

                  {/* FORM */}
                  <FormContainer>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex w-full flex-col space-y-6 "
                      >
                        <FormPasswordInput
                          name="password"
                          InputProps={{ inputSize: "default" }}
                          label="New Password"
                          placeholder="Enter your new password"
                        />

                        <FormPasswordInput
                          name="confirmPassword"
                          InputProps={{ inputSize: "default" }}
                          label="Confirm Password"
                          placeholder="Confirm your new password"
                        />

                        <FormSubmit className="w-full p font-bold mt-3">
                          {CONTENT.main.submitButtonText}
                        </FormSubmit>

                        {/* Back to Login Page link */}
                        <div className="flex justify-center mt-10">
                          <UnderlinedLink href={CONTENT.main.backToLoginLink}>
                            {CONTENT.main.backToLoginText}
                          </UnderlinedLink>
                        </div>
                      </form>
                    </Form>
                  </FormContainer>
                </div>
              </div>
            </div>
          </LoginFormSection>

          {/* RIGHT - IMAGE SECTION */}
          <ImageBanner />
        </div>
      </div>
    </main>
  );
}
