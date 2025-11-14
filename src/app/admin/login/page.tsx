"use client";

import { FormContainer } from "@/client/components/login-register/form-container";
import { ImageBanner } from "@/client/components/login-register/image-banner";
import { LoginContainer } from "@/client/components/login-register/login-container";
import { LoginFormSection } from "@/client/components/login-register/login-form-section";
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

// ---------------- HARDCODED VALUES ----------------
const ADMIN_LOGIN_TITLE = "Lionmarks Admin Login";
const ADMIN_LOGIN_DESCRIPTION = "Lionmarks TMS Platform";
const LOGIN_BUTTON_TEXT = "Log In";
const FORGOT_PASSWORD_TEXT = "Forgot Password?";
const FORGOT_PASSWORD_LINK = "/forgot-password";
const BACK_TO_MAIN_TEXT = "Back to FRBI main page";
const BACK_TO_MAIN_LINK = "/login";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
// ---------------- END HARDCODED VALUES ----------------

export default function AdminLoginPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const login = useMutation(authQueries.login());

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login.mutate(data, {
      onSuccess: () => {
        toast.success("Admin login successful. Redirecting to admin dashboard...");
        router.push("/admin");
      },
      onError: (error) => {
        toast.error(error.message ?? "Admin login failed. Please check your credentials.");
      },
    });
  };

  return (
    <main className="h-screen flex w-full">
      <div className="w-full h-full flex flex-col">
        {/* TOP BAR */}
        <TopBar variant="admin" />

        <div className="flex flex-row flex-1 overflow-hidden">
          <LoginFormSection className="bg-gradient-to-r from-primary to-secondary">
            <LoginContainer className="flex flex-col h-full mt-8">
              <div className="flex flex-1">
                <div className="flex flex-col space-y-1 my-auto w-full">
                  <h1 className="text-center text-white leading-tight mx-auto">
                    {ADMIN_LOGIN_TITLE}
                  </h1>
                  <p className="text-center text-white pt-1 pb-6">{ADMIN_LOGIN_DESCRIPTION}</p>

                  {/* FORM */}
                  <FormContainer className="pb-16">
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col space-y-4 2.5xl:space-y-5"
                      >
                        <FormInput
                          name="email"
                          InputProps={{ inputSize: "default" }}
                          label="Email Address"
                          placeholder="Enter your email"
                        />

                        <FormPasswordInput
                          name="password"
                          InputProps={{ inputSize: "default" }}
                          label="Password"
                          placeholder="Enter your password"
                        />

                        <FormSubmit className="w-full p font-bold">{LOGIN_BUTTON_TEXT}</FormSubmit>

                        <div className="flex justify-center">
                          <UnderlinedLink
                            href={FORGOT_PASSWORD_LINK}
                            className="text-white border-white"
                          >
                            {FORGOT_PASSWORD_TEXT}
                          </UnderlinedLink>
                        </div>

                        <div className="flex items-center">
                          <hr className="w-full" />
                          <p className="  text-secondary font-bold px-3 ">OR</p>
                          <hr className="w-full" />
                        </div>

                        <div className="flex justify-center pt-4">
                          <UnderlinedLink
                            href={BACK_TO_MAIN_LINK}
                            className="text-white border-white"
                          >
                            {BACK_TO_MAIN_TEXT}
                          </UnderlinedLink>
                        </div>
                      </form>
                    </Form>
                  </FormContainer>
                </div>
              </div>
            </LoginContainer>
          </LoginFormSection>

          {/* RIGHT - IMAGE SECTION */}
          <ImageBanner />
        </div>
      </div>
    </main>
  );
}
