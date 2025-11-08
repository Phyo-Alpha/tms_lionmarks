"use client";

import { ButtonCustom } from "@/client/components/ui/button-custom";
import { ImageBanner } from "@/client/components/login-register/image-banner";
import { TopBar } from "@/client/components/login-register/top-bar";
import { LogoTitleDescription } from "@/client/components/login-register/logo-title-description";
import { useRouter } from "next/navigation";
import { TrustedByCompanies } from "@/client/components/login-register/trusted-by-companies";
import { LoginFormSection } from "@/client/components/login-register/login-form-section";

//---------------- HARDCODED VALUES ----------------
const verified_email = "alex.chong@cda.com.sg";
const CONTENT = {
  main: {
    title: "You’re All Set Up!",
    description: `Your email <span class='font-bold'>${verified_email}</span> has been verified.<br/> Start your FRBI journey now and get your business future ready.`,
    mobileDescription: `Your email <span class='font-bold'>${verified_email}</span> has been verified. Start your FRBI journey now and get your business future ready.`,
    submitButtonLoadingText: "Get Future Ready",
  },
};
//---------------- END HARDCODED VALUES ----------------

export default function VerificationSuccessPage() {
  const router = useRouter();
  return (
    <main className="h-screen flex w-full">
      <div className="w-full h-full flex flex-col">
        {/* TOP BAR */}
        <TopBar />

        <div className="flex flex-row flex-1 overflow-hidden">
          {/* LEFT - LOGIN SECTION */}

          <LoginFormSection className="bg-sbf-off-white">
            <div className="flex flex-col h-full px-10 5xl:px-0 5xl:max-w-225 5xl:mx-auto">
              <div className="flex flex-1">
                <div className="flex flex-col space-y-6 my-auto w-full">
                  <LogoTitleDescription
                    title={CONTENT.main.title}
                    description={CONTENT.main.description}
                    mobileDescription={CONTENT.main.mobileDescription}
                  />
                  <ButtonCustom
                    onClick={() => router.push("/demographic")}
                    className="sm:w-[70%] 2xl:w-3/5 3xl:w-3/5 4xl:w-[55%] mx-auto p font-bold"
                  >
                    {CONTENT.main.submitButtonLoadingText}
                  </ButtonCustom>
                </div>
              </div>
              {/* Trusted by companie & Back to main page link */}
              <TrustedByCompanies />
            </div>
          </LoginFormSection>

          {/* RIGHT - IMAGE SECTION */}
          <ImageBanner />
        </div>
      </div>
    </main>
  );
}
