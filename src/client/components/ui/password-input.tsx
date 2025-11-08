import { Button } from "@/client/components/ui/button";
import { Input, InputProps } from "@/client/components/ui/input";
import { cn } from "@/client/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

// copied from https://gist.github.com/mjbalcueva/b21f39a8787e558d4c536bf68e267398
export const PasswordInput = ({
  ref,
  className,
  ...props
}: InputProps & {
  ref: React.RefObject<HTMLInputElement>;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const disabled = props.value === "" || props.value === undefined || props.disabled;

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={cn("hide-password-toggle pr-10", className)}
        ref={ref}
        {...props}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword((prev) => !prev)}
        disabled={disabled}
      >
        {showPassword && !disabled ? (
          <EyeIcon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
        )}
        <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
      </Button>

      {/* hides browsers password toggles */}
      <style>{`
                  .hide-password-toggle::-ms-reveal,
                  .hide-password-toggle::-ms-clear {
                      visibility: hidden;
                      pointer-events: none;
                      display: none;
                  }
              `}</style>
    </div>
  );
};
PasswordInput.displayName = "PasswordInput";
