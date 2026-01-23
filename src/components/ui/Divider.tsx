"use client";

import React from "react";
import { cx } from "@/lib/utils";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Divider({ className, ...props }: DividerProps) {
  return (
    <div
      className={cx("h-px w-full bg-gray-200 dark:bg-gray-800", className)}
      {...props}
    />
  );
}
