"use client";

import { DriverForm } from "@/components/drivers/DriverForm";

export default function NewDriverPage() {
  return (
    <div className="mx-auto max-w-6xl pb-20">
      <div className="mb-10 flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-gray-800">Nuevo Conductor</h1>
        <p className="text-sm text-gray-600">
          Registra un nuevo conductor y sus credenciales de acceso.
        </p>
      </div>

      <div>
        <DriverForm initialData={{}} />
      </div>
    </div>
  );
}
