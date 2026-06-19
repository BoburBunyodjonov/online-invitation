"use client";

import Link from "next/link";
import { Button, type ButtonProps } from "@mui/material";

type LinkButtonProps = ButtonProps & {
  href: string;
};

/** Client-side Next.js Link + MUI Button (avoids passing Link into MUI from RSC). */
export function LinkButton({ href, ...props }: LinkButtonProps) {
  return (
    <Button component={Link} href={href} {...props} />
  );
}
