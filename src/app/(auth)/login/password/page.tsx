"use client";

import { FormContainer } from "@/client/components/login-register/form-container";
import { ImageBanner } from "@/client/components/login-register/image-banner";
import { LinkRow } from "@/client/components/login-register/link-row";
import { LoginContainer } from "@/client/components/login-register/login-container";
import { LoginFormSection } from "@/client/components/login-register/login-form-section";
import { LogoTitleDescription } from "@/client/components/login-register/logo-title-description";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const CONTENT = {
  title: "Welcome Back, Admin",
  description: "Looks like you already have an Lionmarks TMS account — sign in below to continue.",
  submitButtonText: "Log In",
  submitButtonLoadingText: "Signing in...",
  notUserText: "Not {email}?",
  forgotPasswordText: "Forgot Password?",
  notUserLink: "/login",
  forgotPasswordLink: "/forgot-password",
};

const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function LoginPasswordPage() {
  const router = useRouter();
  const [emailFromParams] = useQueryState("email", parseAsString.withDefault(""));
  const [passwordError, setPasswordError] = useState("");

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
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

  const login = useMutation(authQueries.login());

  const onPasswordSubmit = async (data: z.infer<typeof loginSchema>) => {
    setPasswordError("");
    await login
      .mutateAsync(data, {
        // TODO: handle for different type of roles when it is time for it
        onSuccess: () => {
          toast.success("Login Successful. Redirecting to dashboard ...");
          router.push("/admin");
        },
      })
      .catch((err) => {
        setPasswordError("Incorrect password. Please try again.");
        toast.error(err.message ?? "Login Failed. Unknown Failure.");
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

                  <Form {...loginForm}>
                    <FormContainer
                      as="form"
                      onSubmit={loginForm.handleSubmit(onPasswordSubmit)}
                      className="pb-16 2.5xl:pb-20"
                    >
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
                        label="Password"
                        placeholder="Enter your password"
                      />

                      {!loginForm.formState.errors.password && passwordError && (
                        <p className="text-red-500">{passwordError}</p>
                      )}

                      <FormSubmit className="w-full p font-bold">
                        {login.isPending
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
                        <UnderlinedLink
                          href={`${CONTENT.forgotPasswordLink}?email=${encodeURIComponent(emailFromParams)}`}
                        >
                          {CONTENT.forgotPasswordText}
                        </UnderlinedLink>
                      </LinkRow>
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
