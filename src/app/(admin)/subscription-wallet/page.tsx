"use client";

import { DataTable } from "@/components/data-table/DataTable";
import { movementColumns } from "@/components/data-table/columns/columns-movements";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { movements } from "@/mocks/movements";
import { CreditCard } from "lucide-react";

export default function SubscriptionWalletPage() {
  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto pt-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="font-medium text-2xl">Suscripción y saldo</h1>
        <p className="text-sm font-medium text-gray-500">
          Gestiona los pagos y saldo de tu cuenta.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 font-geist border-b border-gray-200 p-6">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-50">
              Plan de suscripción
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Tarifa fija que que se paga mensualmente.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <h2 className="font-medium text-2xl">$1,800.00 MXN</h2>
              <Badge variant="success">Activo</Badge>
            </div>
            <p className="text-sm text-gray-500">/ mensualmente</p>
          </div>
          <div className="flex items-center justify-end">
            <Button variant="secondary" className="w-fit cursor-pointer">
              Cancelar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 font-geist border-b border-gray-200 p-6">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-50">
              Saldo disponible
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Saldo disponible para realizar viajes.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-2xl">$520.00 MXN</h2>
            <Button variant="primary" className="w-fit cursor-pointer">Añadir saldo</Button>
          </div>
        </div>

        <div className="grid items-center grid-cols-1 gap-10 md:grid-cols-3 font-geist border-b border-gray-200 p-6">
          <div>
            <h2 className="font-semibold text-gray-900 dark:text-gray-50">
              Formas de pago
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Los pagos de tu suscripción se realizan con la tarjeta
              predeterminada.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard strokeWidth={1.3} className="text-gray-400" />
            <p className="text-sm text-gray-500">Sin tarjeta predeterminada</p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <DataTable
          data={movements || []}
          columns={movementColumns}
          searchPlaceholder="Buscar movimientos..."
          searchColumn="name"
          rowCount={movements.length}
        />
      </div>
    </div>
  );
}
