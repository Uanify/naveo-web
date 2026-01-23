"use client";

import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cx, focusInput, hasErrorInput } from "@/lib/utils";

const textareaStyles = tv({
  base: [
    "relative block min-h-20 w-full appearance-none rounded-md border px-2.5 py-2 shadow-xs outline-hidden transition sm:text-sm",
    "border-gray-300 dark:border-gray-800",
    "text-gray-900 dark:text-gray-50",
    "placeholder-gray-400 dark:placeholder-gray-500",
    "bg-white dark:bg-gray-950",
    "disabled:border-gray-300 disabled:bg-gray-100 disabled:text-gray-400",
    "dark:disabled:border-gray-700 dark:disabled:bg-gray-800 dark:disabled:text-gray-500",
    focusInput,
  ],
  variants: {
    hasError: {
      true: hasErrorInput,
    },
  },
});

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaStyles> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, ...props }, forwardedRef) => {
    return (
      <textarea
        ref={forwardedRef}
        className={cx(textareaStyles({ hasError }), className)}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
