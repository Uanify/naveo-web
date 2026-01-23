"use client";

import { BranchForm } from "@/components/branches/BranchForm";

export default function NewBranchPage() {
  return (
    <div className="mx-auto max-w-6xl pb-20">
      <div className="mb-10 flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-gray-800">Nueva Sucursal</h1>
        <p className="text-sm text-gray-600">
          Crea una nueva sucursal completando el siguiente formulario.
        </p>
      </div>

      <div>
        <BranchForm initialData={{}} />
      </div>
    </div>
  );
}
