"use client";
import Image, { type ImageProps } from "next/image";
import { forwardRef } from "react";

interface BaseHubImageProps extends Omit<ImageProps, "src"> {
  src: string;
}

export const BaseHubImage = forwardRef<HTMLImageElement, BaseHubImageProps>(
  ({ src, alt, ...props }, ref) => {
    return (
      <Image
        ref={ref}
        src={src}
        alt={alt}
        {...props}
      />
    );
  }
);

BaseHubImage.displayName = "BaseHubImage";