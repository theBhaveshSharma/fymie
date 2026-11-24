"use client";

import Image, { type ImageProps } from "next/image";
import { assetUrl } from "@/lib/asset";

type AppImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

/** next/image wrapper that respects GitHub Pages basePath for public assets. */
export function AppImage({ src, alt, ...props }: AppImageProps) {
  return <Image src={assetUrl(src)} alt={alt} {...props} />;
}
