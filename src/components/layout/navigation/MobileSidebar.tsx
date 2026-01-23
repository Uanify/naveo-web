"use client";

import { siteConfig } from "@/app/siteConfig";
import { Button } from "@/components/ui/Button";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import { cx, focusRing } from "@/lib/utils";
import {
  RiBox3Line,
  RiUserStarLine,
  RiUser6Line,
  RiStore2Line,
  RiMenuLine,
  RiWebhookLine,
} from "@remixicon/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

// Definimos la interfaz para los datos del usuario
interface MobileSidebarProps {
  userData: {
    fullName: string;
    email: string;
    companyName: string;
    avatarUrl: string | null;
  };
}

const navigation = [
/*   {
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
  {
    name: "Naveo Connect",
    href: siteConfig.baseLinks.naveoConnect,
    icon: RiWebhookLine,
  },
] as const;

export default function MobileSidebar({ userData }: MobileSidebarProps) {
  const pathname = usePathname();

  const isActive = (itemHref: string) => {
    return (
      pathname === itemHref ||
      (itemHref !== "/orders" && pathname.startsWith(itemHref))
    );
  };

  return (
    <>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            aria-label="Abrir menú"
            className="group flex items-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 data-[state=open]:bg-gray-100 dark:hover:bg-gray-400/10"
          >
            <RiMenuLine
              className="size-6 shrink-0 sm:size-5"
              aria-hidden="true"
            />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="sm:max-w-lg">
          <DrawerHeader className="px-6 pt-6">
            <div className="flex items-center gap-3">
              {/* Avatar de Google o Iniciales de la Empresa */}
              {userData.avatarUrl ? (
                <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={userData.avatarUrl}
                    alt={userData.fullName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-xs">
                  {userData.companyName.substring(0, 2).toUpperCase()}
                </div>
              )}

              <div className="flex flex-col text-left overflow-hidden">
                <DrawerTitle className="truncate text-sm font-semibold text-gray-900 dark:text-gray-50">
                  {userData.companyName}
                </DrawerTitle>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {userData.email}
                </p>
              </div>
            </div>
          </DrawerHeader>
          <DrawerBody className="px-4">
            <nav
              aria-label="Navegación móvil Naveo"
              className="flex flex-1 flex-col space-y-10"
            >
              {/* Menú Operativo */}
              <div>
                <span className="px-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Menú Operativo
                </span>
                <ul role="list" className="mt-3 space-y-1.5">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <DrawerClose asChild>
                        <Link
                          href={item.href}
                          className={cx(
                            isActive(item.href)
                              ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                              : "text-gray-600 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                            "flex items-center gap-x-3 rounded-md px-2 py-2.5 text-base font-medium transition hover:bg-gray-100 sm:text-sm hover:dark:bg-gray-900",
                            focusRing
                          )}
                        >
                          <item.icon
                            className="size-5 shrink-0"
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </DrawerClose>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
