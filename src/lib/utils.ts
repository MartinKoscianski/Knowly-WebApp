// src/lib/utils.ts
// Utilitaire pour shadcn/ui (cn = classNames)

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
