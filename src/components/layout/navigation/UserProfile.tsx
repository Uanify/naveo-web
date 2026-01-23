"use client";

import { Button } from "@/components/ui/Button";
import { cx, focusRing } from "@/lib/utils";
import { RiMore2Fill } from "@remixicon/react";
import { DropdownUserProfile } from "./DropdownUserProfile";
import Image from "next/image";

interface UserProfileProps {
  userData: {
    fullName: string;
    email: string;
    companyName: string;
    avatarUrl: string | null;
  };
}

export const UserProfileDesktop = ({ userData }: UserProfileProps) => {
  // Obtenemos iniciales para el fallback
  const initials = userData.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    /* Pasamos userData al Dropdown para que muestre el email y nombre reales */
    <DropdownUserProfile userData={userData}>
      <Button
        aria-label="Ajustes de usuario"
        variant="ghost"
        className={cx(
          focusRing,
          "group w-full justify-between cursor-pointer rounded-md p-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-900"
        )}
      >
        <span className="flex items-center gap-3 overflow-hidden">
          {userData.avatarUrl ? (
            <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-gray-200 dark:border-gray-800">
              <Image
                src={userData.avatarUrl}
                alt={userData.fullName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
              aria-hidden="true"
            >
              {initials}
            </span>
          )}
          <span className="truncate text-gray-900 dark:text-gray-50">
            {userData.fullName}
          </span>
        </span>

        <RiMore2Fill
          className="size-4 shrink-0 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-400"
          aria-hidden="true"
        />
      </Button>
    </DropdownUserProfile>
  );
};

export const UserProfileMobile = ({ userData }: UserProfileProps) => {
  const initials = userData.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    /* Pasamos userData también en la versión móvil */
    <DropdownUserProfile align="end" userData={userData}>
      <Button
        aria-label="Ajustes de usuario"
        variant="ghost"
        className="group flex items-center rounded-md p-1 cursor-pointer"
      >
        {userData.avatarUrl ? (
          <div className="relative size-7 shrink-0 overflow-hidden rounded-full border border-gray-200 dark:border-gray-800">
            <Image
              src={userData.avatarUrl}
              alt={userData.fullName}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs font-semibold text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
            aria-hidden="true"
          >
            {initials}
          </span>
        )}
      </Button>
    </DropdownUserProfile>
  );
};
