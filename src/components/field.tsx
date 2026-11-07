import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";

export function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string[];
  children: ReactNode;
}) {
  const message = error?.[0];
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {message ? (
        <p id={`${htmlFor}-error`} className="text-destructive text-sm">
          {message}
        </p>
      ) : null}
    </div>
  );
}
