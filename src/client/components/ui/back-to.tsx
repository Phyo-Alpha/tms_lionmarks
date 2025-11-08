import { ArrowLeft } from "lucide-react";

import Link from "next/link";
import { Button } from "./button";

export type BackToProps = {
  href: string;
  label: string;
};

export function BackTo({ href, label }: BackToProps) {
  return (
    <Button variant="ghost" className="flex flex-row gap-2">
      <ArrowLeft />
      <Link href={href}>{label}</Link>
    </Button>
  );
}
