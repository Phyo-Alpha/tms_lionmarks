import { ButtonCustom } from "@/client/components/ui/button-custom";
import { LoginContainer } from "@/client/components/login-register/login-container";
import Image from "next/image";
import Link from "next/link";

// Mock Data
const TOP_BAR_CONTENT = {
  logo: "/logo2.png",
};

type TopBarProps = {
  variant?: "user" | "admin";
};

export const TopBar = ({ variant = "user" }: TopBarProps) => {
  const buttonText = variant === "admin" ? "User Login" : "Lionmarks Admin Login";
  const buttonLink = variant === "admin" ? "/login" : "/admin/login";

  return (
    <LoginContainer
      as="header"
      paddingOnly={true}
      className="flex items-center justify-between py-5 2.5xl:py-6 bg-card shadow-md relative z-10"
    >
      <Link href="/login">
        <Image src={TOP_BAR_CONTENT.logo} width={200} height={100} alt="Company Logo" />
      </Link>

      <div>
        <ButtonCustom href={buttonLink} bordered={true} className="px-4 sm:px-6">
          {buttonText}
        </ButtonCustom>
      </div>
    </LoginContainer>
  );
};
