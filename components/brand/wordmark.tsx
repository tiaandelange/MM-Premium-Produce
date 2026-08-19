import Image from "next/image";
import { getSiteConfig } from "@/config/site";

export function Wordmark({
  inverse = false,
}: {
  inverse?: boolean;
  compact?: boolean;
}) {
  const { logoPath } = getSiteConfig();
  const size = 60;

  return (
    <span className={`inline-flex rounded-full p-0.5 ${inverse ? "bg-logo-plate-inverse" : "bg-logo-plate"}`}>
      <Image
        src={logoPath}
        alt="M&M Premium Produce"
        width={size}
        height={size}
        className="h-[3.75rem] w-[3.75rem] object-contain"
        priority={false}
      />
    </span>
  );
}
