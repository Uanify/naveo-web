"use client";
import { cx, focusRing } from "@/lib/utils";
import {
  RiBox3Line,
  RiUserStarLine,
  RiUser6Line,
  RiStore2Line,
  RiWebhookLine,
} from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileSidebar from "./MobileSidebar";
import { UserProfileDesktop, UserProfileMobile } from "./UserProfile";
import { siteConfig } from "@/app/siteConfig";
import Image from "next/image";

const navigation = [
  /* {
    name: "Dashboard",
    href: siteConfig.baseLinks.dashboard,
    icon: RiDashboardLine,
  }, */
  { name: "Pedidos", href: siteConfig.baseLinks.orders, icon: RiBox3Line },
  {
    name: "Choferes",
    href: siteConfig.baseLinks.drivers,
    icon: RiUserStarLine,
  },
  { name: "Clientes", href: siteConfig.baseLinks.clients, icon: RiUser6Line },
  {
    name: "Sucursales",
    href: siteConfig.baseLinks.branches,
    icon: RiStore2Line,
  },
];

const integrationLinks = [
  {
    name: "Naveo Connect",
    href: siteConfig.baseLinks.naveoConnect,
    icon: RiWebhookLine,
  },
];

interface SidebarProps {
  userData: {
    fullName: string;
    email: string;
    companyName: string;
    avatarUrl: string | null;
  };
}

export function Sidebar({ userData }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (itemHref: string) => {
    return (
      pathname === itemHref ||
      (itemHref !== "/orders" && pathname.startsWith(itemHref))
    );
  };

  return (
    <>
      <nav className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <aside className="flex grow flex-col gap-y-3 overflow-y-auto border-r border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center gap-3 px-2 pt-4 pb-2">
            {userData.avatarUrl ? (
              <div className="relative size-9 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={userData.avatarUrl}
                  alt={userData.fullName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-semibold text-xs">
                {userData.companyName.substring(0, 2).toUpperCase()}
              </div>
            )}

            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-sm font-semibold text-gray-900 dark:text-gray-50">
                {userData.companyName}
              </span>
              <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                {userData.email}
              </span>
            </div>
          </div>

          <nav className="flex flex-1 flex-col space-y-8">
            <div>
              <ul role="list" className="mt-2 space-y-0.5">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cx(
                        isActive(item.href)
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700 hover:text-gray-900",
                        "flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition hover:bg-gray-100",
                        focusRing,
                      )}
                    >
                      <item.icon className="size-4 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                ))}
                <div className="mt-6 flex flex-col gap-3">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Integraciones</p>
                  {integrationLinks.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cx(
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700 hover:text-gray-900",
                          "flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition hover:bg-gray-100",
                          focusRing,
                        )}
                      >
                        <item.icon className="size-4 shrink-0" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </div>
              </ul>
            </div>
          </nav>

          <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-800">
            <UserProfileDesktop userData={userData} />
          </div>
        </aside>
      </nav>

      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded bg-blue-600 text-white font-bold text-xs">
            {userData.companyName[0]}
          </div>
          <span className="font-bold text-gray-900">
            {userData.companyName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UserProfileMobile userData={userData} />
          <MobileSidebar userData={userData} />
        </div>
      </div>
    </>
  );
}
