"use client";

import { FormContainer } from "@/client/components/login-register/form-container";
import { ImageBanner } from "@/client/components/login-register/image-banner";
import { LinkRow } from "@/client/components/login-register/link-row";
import { LoginContainer } from "@/client/components/login-register/login-container";
import { LoginFormSection } from "@/client/components/login-register/login-form-section";
import { LogoTitleDescription } from "@/client/components/login-register/logo-title-description";
import { InfoBox } from "@/client/components/login-register/register/infobox";
import { TopBar } from "@/client/components/login-register/top-bar";
import { UnderlinedLink } from "@/client/components/login-register/underlined-link";
import { Form } from "@/client/components/ui/form";
import { FormInput } from "@/client/components/ui/form/form-input";
import { FormPasswordInput } from "@/client/components/ui/form/form-password-input";
import { FormSubmit } from "@/client/components/ui/form/form-submit";
import { authQueries } from "@/client/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const CONTENT = {
  title: "Let's create your FRBI account.",
  description: "This process will only take a few minutes",
  submitButtonText: "Create an Account",
  submitButtonLoadingText: "Creating account...",
  notUserText: "Not {email}?",
  notUserLink: "/login",
  info: "Each business should create only one account on the FRBI Portal. This should be done by someone who can delegate tasks to employees. <br/> </br/> Once created, the account owner can invite their team to complete the relevant survey sections.",
};

const registerSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const router = useRouter();
  const [emailFromParams] = useQueryState("email", parseAsString.withDefault(""));

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    values: {
      email: emailFromParams,
      password: "",
    },
  });

  useEffect(() => {
    if (!emailFromParams) {
      router.push("/login");
    }
  }, [emailFromParams, router]);

  const register = useMutation(authQueries.register());

  const onRegisterSubmit = async (data: z.infer<typeof registerSchema>) => {
    await register
      .mutateAsync(data, {
        onSuccess: () => {
          router.push(`/verification?email=${encodeURIComponent(data.email)}`);
        },
      })
      .catch((error) => {
        toast.error(error.message ?? "Registration failed. Please try again.");
      });
  };

  const handleNotUserClick = () => {
    router.push("/login");
  };

  if (!emailFromParams) {
    return null;
  }

  return (
    <main className="h-screen flex w-full">
      <div className="w-full h-full flex flex-col">
        <TopBar variant="user" />

        <div className="flex flex-row flex-1 overflow-hidden">
          <LoginFormSection className="bg-sbf-off-white">
            <LoginContainer className="flex flex-col h-full overflow-y-auto py-10 ">
              <div className="flex flex-1 ">
                <div className="flex flex-col space-y-6 my-auto w-full">
                  <LogoTitleDescription title={CONTENT.title} description={CONTENT.description} />

                  <Form {...registerForm}>
                    <FormContainer as="form" onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                      <FormInput
                        name="email"
                        InputProps={{
                          inputSize: "default",
                          disabled: true,
                        }}
                        label="Email Address"
                        placeholder="Enter your email"
                      />
                      <FormPasswordInput
                        name="password"
                        InputProps={{ inputSize: "default" }}
                        label="Create Password"
                        placeholder="Create a password"
                      />

                      <FormSubmit className="w-full p font-bold" disabled={register.isPending}>
                        {register.isPending
                          ? CONTENT.submitButtonLoadingText
                          : CONTENT.submitButtonText}
                      </FormSubmit>

                      <LinkRow>
                        <UnderlinedLink
                          href={CONTENT.notUserLink}
                          className="text-[#54627E] cursor-pointer"
                          onClick={handleNotUserClick}
                        >
                          {CONTENT.notUserText.replace("{email}", emailFromParams)}
                        </UnderlinedLink>
                      </LinkRow>
                    </FormContainer>

                    <InfoBox>{CONTENT.info}</InfoBox>
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
