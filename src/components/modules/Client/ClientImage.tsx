import { useState } from "react";
import { Handshake } from "lucide-react";

import { cn } from "@/lib/utils";

type ClientImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  iconClassName?: string;
};

const ClientImage = ({ src, alt, className, iconClassName }: ClientImageProps) => {
  const imageSrc = typeof src === "string" ? src.trim() : "";
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (imageSrc && failedSrc !== imageSrc) {
    return <img src={imageSrc} alt={alt} className={className} onError={() => setFailedSrc(imageSrc)} />;
  }

  return (
    <div role="img" aria-label={alt} className={cn("flex items-center justify-center bg-muted/40 text-muted-foreground", className)}>
      <Handshake className={cn("h-12 w-12 text-blue-700/80 dark:text-blue-300", iconClassName)} aria-hidden="true" />
    </div>
  );
};

export default ClientImage;
