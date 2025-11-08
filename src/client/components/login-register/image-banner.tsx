import Image from "next/image";

// Mock Data
const BANNER_IMAGE = {
  src: "/images/login-image.jpg",
  alt: "Login page illustration",
  width: 500,
  height: 800,
};

export const ImageBanner = () => {
  return (
    <div className="hidden md:flex flex-1">
      <div className="w-full h-full">
        <Image
          src={BANNER_IMAGE.src}
          width={BANNER_IMAGE.width}
          height={BANNER_IMAGE.height}
          alt={BANNER_IMAGE.alt}
          className="h-full w-full object-cover object-center"
        />
      </div>
    </div>
  );
};
