import Image from "next/image";

const LOGO_IMAGE = {
  src: "/logo2.png",
  alt: "Company Logo",
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
      <div className="w-fit mx-auto pb-4">
        <Image
          src={LOGO_IMAGE.src}
          alt={LOGO_IMAGE.alt}
          width={300}
          height={300}
          className="aspect-video object-cover h-26"
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
