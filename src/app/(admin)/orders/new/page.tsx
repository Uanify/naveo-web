"use client";

import { OrderForm } from "@/components/orders/OrdersForm";

export default function NewOrderPage() {
  return (
    <div className="mx-auto max-w-6xl pb-20 p-4">
      <div className="mb-10 flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-gray-800">Nuevo pedido</h1>
        <p className="text-sm text-gray-600">
          Registra un nuevo pedido completando el formulario.
        </p>
      </div>

      <div>
        <OrderForm  />
      </div>
    </div>
  );
}
