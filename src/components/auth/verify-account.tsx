import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { RiMailFill } from "@remixicon/react";

export function VerifyAccount() {
  return (
    <div className="mx-auto max-w-sm w-full text-center">
      <div className="flex flex-col items-center gap-2 mb-8">
        {/* Visual indicator for email sent */}
        <div className="rounded-full bg-blue-50 p-3 dark:bg-blue-900/20 mb-2">
          <RiMailFill
            className="size-7 text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          />
        </div>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
          Verificar cuenta
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Te hemos enviado un enlace de confirmación. Por favor, revisa tu
          bandeja de entrada para activar tu cuenta.
        </p>
      </div>

      <Link href="/login" className="w-full">
        <Button variant="secondary" className="w-full cursor-pointer">
          Volver al inicio de sesión
        </Button>
      </Link>

      <p className="mt-6 text-xs text-gray-400 dark:text-gray-600">
        ¿No recibiste el correo? Revisa tu carpeta de spam o intenta registrarte
        de nuevo.
      </p>
    </div>
  );
}
