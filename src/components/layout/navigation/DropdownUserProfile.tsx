"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown";
import { RiLogoutBoxLine } from "@remixicon/react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";

export type DropdownUserProfileProps = {
  children: ReactNode;
  align?: "center" | "start" | "end";
  userData: {
    email: string;
    fullName: string;
  };
};

export function DropdownUserProfile({
  children,
  align = "start",
  userData,
}: DropdownUserProfileProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Sesión cerrada correctamente");
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Error al cerrar sesión");
      console.error(error);
    }
  };

  if (!mounted) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-50">
              {userData.fullName}
            </p>
            <p className="text-xs leading-none text-gray-500">
              {userData.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link href="/profile">
            <DropdownMenuItem>Perfil</DropdownMenuItem>
          </Link>
          {/* <Link href="/subscription-wallet">
            <DropdownMenuItem>Suscripción y saldo</DropdownMenuItem>
          </Link> */}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={handleSignOut}>
          <RiLogoutBoxLine className="mr-2 size-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
