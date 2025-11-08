import Image from "next/image";
import Link from "next/link";

const TRUSTED_BY_COMPANIES = [
  {
    id: 1,
    name: "Company 1",
    logo: "/images/dummy-company-1.png",
  },
  {
    id: 2,
    name: "Company 2",
    logo: "/images/dummy-company-2.png",
  },
  {
    id: 3,
    name: "Company 3",
    logo: "/images/dummy-company-3.png",
  },
];

const CONTENT = {
  trustedByText: "Trusted by top companies across various industries",
  backLinkText: "Back to FRBI Main Page",
  backLinkUrl: "/",
};

export const TrustedByCompanies = () => {
  return (
    <div className="h-[11rem] 2.5xl:h-[12rem] 3xl:h-[14rem] 4xl:h-[15rem] pb-10">
      <p className="text-center text-sbf-medum-dark-gray">{CONTENT.trustedByText}</p>
      <div className="flex justify-center items-center sm:gap-8 mb-1 3xl:mb-2">
        {TRUSTED_BY_COMPANIES.map((company) => (
          <div key={company.id} className=" h-full sm:h-20 2xl:h-[5.5rem] 3xl:h-28">
            <Image
              src={company.logo}
              alt={company.name}
              width={200}
              height={100}
              className="h-full w-auto object-contain opacity-70"
            />
          </div>
        ))}
      </div>

      <Link
        href={CONTENT.backLinkUrl}
        className="block text-center border-b border-black w-fit mx-auto p"
      >
        {CONTENT.backLinkText}
      </Link>
    </div>
  );
};
