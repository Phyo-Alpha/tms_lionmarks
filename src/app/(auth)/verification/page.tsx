"use client";

import { FormContainer } from "@/client/components/login-register/form-container";
import { ImageBanner } from "@/client/components/login-register/image-banner";
import { LoginContainer } from "@/client/components/login-register/login-container";
import { LoginFormSection } from "@/client/components/login-register/login-form-section";
import { LogoTitleDescription } from "@/client/components/login-register/logo-title-description";
import { TopBar } from "@/client/components/login-register/top-bar";
import { Button } from "@/client/components/ui/button";
import { Form } from "@/client/components/ui/form";
import { FormInput } from "@/client/components/ui/form/form-input";
import { authClient } from "@/client/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function VerificationPage() {
  const [userEmail] = useQueryState("email", parseAsString.withDefault(""));
  const router = useRouter();
  const emailForm = useForm({
    defaultValues: {
      email: userEmail,
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      const session = await authClient.getSession();
      if (session.data) {
        router.refresh();
      }
    };

    window.addEventListener("focus", checkSession);

    return () => {
      window.removeEventListener("focus", checkSession);
    };
  }, [router]);
  return (
    <main className="h-screen flex w-full">
      <div className="w-full h-full flex flex-col">
        {/* TOP BAR */}
        <TopBar />

        <div className="flex flex-row flex-1 overflow-hidden">
          {/* LEFT - LOGIN SECTION */}
          <LoginFormSection className="bg-sbf-off-white">
            <LoginContainer className="flex flex-col h-full ">
              <div className="flex flex-1">
                <div className="flex flex-col space-y-6 my-auto w-full">
                  <LogoTitleDescription
                    title="Check Your Inbox for a Verification Link"
                    description="To verify that the following email is yours,<br/> use the link we've sent to login, no password is required."
                  />

                  {/* CONTENT */}
                  <FormContainer>
                    <Form {...emailForm}>
                      <form className="flex w-full flex-col space-y-6 ">
                        <FormInput
                          name="email"
                          InputProps={{
                            inputSize: "default",
                            disabled: true,
                          }}
                          label="Email Address"
                          placeholder="Enter your email"
                        />

                        <Button className="w-full p font-bold mt-3" asChild>
                          <Link href={`/login?email=${userEmail}`}>Back to Login</Link>
                        </Button>
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
