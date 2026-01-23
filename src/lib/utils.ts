import clsx, { type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args))
}

// Tremor focusInput [v0.0.2]

export const focusInput = [
  // base
  "focus:ring-2",
  // ring color
  "focus:ring-blue-200 dark:focus:ring-blue-700/30",
  // border color
  "focus:border-blue-500 dark:focus:border-blue-700",
]

// Tremor Raw focusRing [v0.0.1]

export const focusRing = [
  // base
  "outline outline-offset-2 outline-0 focus-visible:outline-2",
  "outline-blue-500 dark:outline-blue-500",
]

export const hasErrorInput = [
  "ring-2",
  "border-red-500 dark:border-red-700",
  "ring-red-200 dark:ring-red-700/30",
]

export const usNumberformatter = (number: number, decimals = 0) =>
  Intl.NumberFormat("us", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
    .format(Number(number))
    .toString()

export const formatters: { [key: string]: any } = {
  currency: (value: number | string, currency: string = "MXN") => {
    const parsedValue = typeof value === "number" ? value : parseFloat(value);

    const finalValue = isNaN(parsedValue) ? 0 : parsedValue;

    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(finalValue);
  },
  unit: (number: number) => `${usNumberformatter(number)}`,
};

export const percentageFormatter = (value: number) => {
  if (isNaN(value) || !isFinite(value)) return "0%";

  return new Intl.NumberFormat("es-MX", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
};

export function getPagination(searchPage: string | undefined, pageSize = 20) {
  const currentPage = Number(searchPage) || 1;
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;
  return { currentPage, from, to, pageSize };
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
