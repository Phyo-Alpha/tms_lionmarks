import { Button } from "@/client/components/ui/button";
import { cn } from "@/client/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

import type { FormInputProps } from "./form-input";
import { FormInput } from "./form-input";

export const FormPasswordInput = ({
  ref,
  className,
  InputProps,
  ...props
}: FormInputProps & {
  ref?: React.RefObject<HTMLInputElement>;
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <FormInput
        {...props}
        InputProps={{ type: showPassword ? "text" : "password" }}
        FormControlProps={{
          children: (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 bottom-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={InputProps?.disabled}
            >
              {showPassword && !InputProps?.disabled ? (
                <EyeIcon className="size-4" aria-hidden="true" />
              ) : (
                <EyeOffIcon className="size-4" aria-hidden="true" />
              )}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          ),
          className: "relative",
        }}
        inputClassName={cn("hide-password-toggle pr-10", className)}
        ref={ref}
      />

      {/* hides browsers password toggles */}
      <style>
        {`
                  .hide-password-toggle::-ms-reveal,
                  .hide-password-toggle::-ms-clear {
                      visibility: hidden;
                      pointer-events: none;
                      display: none;
                  }
              `}
      </style>
    </>
  );
};
FormPasswordInput.displayName = "PasswordInput";
