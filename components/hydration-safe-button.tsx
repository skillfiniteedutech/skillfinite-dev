"use client";

import { Button } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button";

export function HydrationSafeButton(props: ButtonProps) {
  return <Button {...props} suppressHydrationWarning={true} />;
}