"use client";

import { ClientForm } from "@/components/clients/ClientForm";

export default function NewClientPage() {
  return (
    <div className="mx-auto max-w-6xl pb-20 p-6">
      <div className="mb-10 flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-gray-800">Nuevo Cliente</h1>
        <p className="text-sm text-gray-600">
          Registra un nuevo cliente completando el formulario.
        </p>
      </div>

      <div>
        <ClientForm initialData={{}} />
      </div>
    </div>
  );
}
