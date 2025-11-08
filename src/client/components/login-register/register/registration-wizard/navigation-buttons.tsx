"use client";

import { ButtonCustom } from "@/client/components/ui/button-custom";
import { UnderlinedLink } from "@/client/components/login-register/underlined-link";

type NavigationButtonsProps = {
  onBack?: () => void;
  onNext: () => void;
  showBack: boolean;
  nextButtonText?: string;
};

export const NavigationButtons = ({
  onBack,
  onNext,
  showBack,
  nextButtonText = "Next",
}: NavigationButtonsProps) => {
  return (
    <div className="flex justify-between items-center w-full">
      {showBack ? (
        <UnderlinedLink href="#" onClick={onBack} className="">
          Back
        </UnderlinedLink>
      ) : (
        <span />
      )}
      <ButtonCustom onClick={onNext} className="px-8">
        {nextButtonText}
      </ButtonCustom>
    </div>
  );
};
