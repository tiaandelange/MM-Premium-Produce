import Image from "next/image";
import { getSiteConfig } from "@/config/site";

export function Wordmark({
  inverse = false,
  compact = false,
}: {
  inverse?: boolean;
  compact?: boolean;
}) {
  const { businessName, logoPath } = getSiteConfig();
  const size = compact ? 52 : 64;

  return (
    <span className="flex items-center gap-3">
      <span className={inverse ? "rounded-full bg-canvas p-0.5" : undefined}>
        <Image
          src={logoPath}
          alt=""
          width={size}
          height={size}
          className={compact ? "h-[52px] w-[52px] object-contain" : "h-16 w-16 object-contain"}
          priority={compact}
        />
      </span>
      <span
        className={`font-heading leading-tight ${compact ? "text-sm sm:text-base" : "text-base"} ${
          inverse ? "text-canvas" : "text-ink"
        }`}
      >
        {businessName}
      </span>
    </span>
  );
}
