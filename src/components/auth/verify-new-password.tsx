import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { RiMailCheckLine } from "@remixicon/react";

export function VerifyNewPassword() {
  return (
    <div className="mx-auto max-w-sm w-full text-center">
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="rounded-full bg-blue-50 p-3 dark:bg-blue-900/20 mb-2">
          <RiMailCheckLine
            className="size-10 text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
          Verificar nueva contraseña
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Hemos enviado un enlace de restablecimiento a tu correo. Si no lo
          recibes en unos minutos, por favor revisa tu carpeta de spam o correo
          no deseado.
        </p>
      </div>

      <Link href="/login" className="w-full">
        <Button variant="secondary" className="w-full cursor-pointer">
          Volver al inicio de sesión
        </Button>
      </Link>

      <p className="mt-6 text-xs text-gray-400 dark:text-gray-600">
        ¿Sigues sin recibirlo? Intenta solicitar el restablecimiento de nuevo
        desde la página anterior.
      </p>
    </div>
  );
}
