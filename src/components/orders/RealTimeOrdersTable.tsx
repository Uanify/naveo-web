"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "@/components/data-table/DataTable";
import { useRouter } from "next/navigation";

export function RealTimeOrdersTable({
  initialOrders,
  columns,
  rowCount,
  ...props
}: any) {
  const [orders, setOrders] = useState(initialOrders);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  useEffect(() => {
    // Suscripción a cambios en la tabla orders
    const channel = supabase
      .channel("realtime_orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          // Opción 1: Actualizar estado local (Rápido)
          // Opción 2: Refrescar los Server Components (Limpio para Next.js)
          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return (
    <DataTable data={orders} columns={columns} rowCount={rowCount} {...props} />
  );
}
