import { LoginContainer } from "@/client/components/login-register/login-container";
import Image from "next/image";
import Link from "next/link";
import { UserCircle } from "lucide-react";
import { cn } from "@/client/lib/utils";

const HEADER_CONTENT = {
  logo: "/logo2.png",
  profileHref: "/admin/profile",
};

function AdminHeader() {
  return (
    <LoginContainer
      as="header"
      paddingOnly={true}
      className={cn(
        "flex items-center justify-between py-5 2.5xl:py-6 bg-primary shadow-md relative z-10",
      )}
    >
      <Link href="/admin" className="flex items-center">
        <Image
          src={HEADER_CONTENT.logo}
          width={100}
          height={100}
          alt="Company Logo"
          className="brightness-0 invert"
        />
      </Link>

      <div>
        <Link
          href={HEADER_CONTENT.profileHref}
          className="flex items-center justify-center p-2 rounded-full transition-all hover:bg-secondary/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-primary"
          aria-label="Profile"
        >
          <UserCircle className="w-8 h-8 2.5xl:w-10 2.5xl:h-10 text-primary-foreground" />
        </Link>
      </div>
    </LoginContainer>
  );
}

export default AdminHeader;
