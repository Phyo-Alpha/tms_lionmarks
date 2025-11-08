import Image from "next/image";

const LOGO_IMAGE = {
  src: "/images/sbf-logo.png",
  alt: "Company Logo",
  width: 200,
  height: 200,
};

interface LogoTitleDescriptionProps {
  title: string;
  mobileTitle?: string;
  description: string;
  mobileDescription?: string;
}

export const LogoTitleDescription = ({
  title,
  mobileTitle,
  description,
  mobileDescription,
}: LogoTitleDescriptionProps) => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="h-8 2.5xl:h-10 4xl:h-12 w-fit mx-auto">
        <Image
          src={LOGO_IMAGE.src}
          width={LOGO_IMAGE.width}
          height={LOGO_IMAGE.height}
          alt={LOGO_IMAGE.alt}
          className="h-full w-auto object-contain"
        />
      </div>
      {mobileTitle ? (
        <>
          <h1
            className="sm:hidden text-center leading-tight mx-auto"
            dangerouslySetInnerHTML={{ __html: mobileTitle }}
          />
          <h1
            className="hidden sm:block text-center leading-tight mx-auto"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </>
      ) : (
        <h1
          className="text-center leading-tight mx-auto"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      )}
      {mobileDescription ? (
        <>
          <p
            className="sm:hidden text-center 2xl:pt-1 2xl:pb-2"
            dangerouslySetInnerHTML={{ __html: mobileDescription }}
          />
          <p
            className="hidden sm:block text-center 2xl:pt-1 2xl:pb-2"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </>
      ) : (
        <p
          className="text-center 2xl:pt-1 2xl:pb-2"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}
    </div>
  );
};
