"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Divider } from "@/components/ui/Divider";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { RowOrderData } from "@/components/orders/RowOrderData";
import { MilestoneContainer } from "@/components/orders/MilestoneContainer";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";

type OrderStatus = "pending" | "in_transit" | "completed" | "cancelled";

type TrackingOrder = {
  id: string;
  order_number: number;
  status: OrderStatus;

  created_at: string;
  scheduled_at: string | null;

  assigned_at: string | null;
  in_transit_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;

  notes: string | null;

  driver_id: string | null;

  clients: { full_name: string | null } | null;
  branches: { name: string | null } | null;
  profiles: { full_name: string | null } | null;
};

type TrackOrderResponse = { order: TrackingOrder } | { error: string };

const statusConfig: Record<
  OrderStatus,
  { label: string; variant: "neutral" | "default" | "success" | "error" }
> = {
  pending: { label: "Pendiente", variant: "neutral" },
  in_transit: { label: "En tránsito", variant: "default" },
  completed: { label: "Completado", variant: "success" },
  cancelled: { label: "Cancelado", variant: "error" },
};

export default function PublicTrackingPage() {
  const { token } = useParams<{ token: string }>();
  const supabase = createClient();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<TrackingOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const statusBadge = useMemo(() => {
    if (!order) return null;
    const cfg = statusConfig[order.status];
    return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
  }, [order]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && token) fetchTrackingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, mounted]);

  async function fetchTrackingData() {
    setLoading(true);
    setError(null);

    try {
      const { data, error } =
        await supabase.functions.invoke<TrackOrderResponse>("track-order", {
          body: { token: String(token) },
        });

      if (error) throw error;

      if (!data || !("order" in data) || !data.order) {
        throw new Error("No se encontró el pedido.");
      }

      setOrder(data.order);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setOrder(null);
      setError(e?.message || "No se pudo cargar el rastreo.");
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (date: string) =>
    format(new Date(date), "dd MMMM, yyyy - HH:mm'h'", { locale: es });

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="font-geist pb-20 px-4 max-w-5xl mx-auto">
        <div className="py-10 flex items-center justify-center">
          <Image src="/naveo-logo.svg" alt="Logo" width={100} height={100} />
        </div>
        <div className="text-sm text-gray-600">Cargando rastreo...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="font-geist pb-20 px-4 max-w-5xl mx-auto">
        <div className="py-10 flex items-center justify-center">
          <Image src="/naveo-logo.svg" alt="Logo" width={100} height={100} />
        </div>
        <div className="p-6 bg-gray-50 border-l-2 border-gray-200">
          <p className="text-sm text-gray-700">
            {error || "No se encontró el pedido."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="font-geist pb-20 px-4 max-w-5xl mx-auto">
      <div className="py-10 flex items-center justify-center">
        <Image src="/naveo-logo.svg" alt="Logo" width={100} height={100} />
      </div>

      <div className="flex flex-col gap-1 mb-10">
        <h1 className="text-xl font-medium text-gray-900 tracking-tight">
          Rastreo de Pedido #{order.order_number}
        </h1>

        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-600">Estado:</p>
          {statusBadge}
        </div>
      </div>

      <Divider className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
        <div className="space-y-12">
          <section>
            <h2 className="text-lg font-medium text-gray-900 mb-8">
              Información del Envío
            </h2>
            <div className="space-y-4">
              <RowOrderData
                title="Destinatario"
                description={order.clients?.full_name || "No disponible"}
              />
              <RowOrderData
                title="Sucursal Origen"
                description={order.branches?.name || "No disponible"}
              />
              <RowOrderData
                title="Operador"
                description={order.profiles?.full_name || "Asignando..."}
              />
              <RowOrderData
                title="Fecha Programada"
                description={
                  order.scheduled_at
                    ? formatDate(order.scheduled_at)
                    : "Pendiente"
                }
              />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-medium text-gray-600 mb-6">
              Instrucciones
            </h2>
            <div className="p-6 bg-gray-50 border-l-2 border-gray-200">
              <p className="text-sm text-gray-600 leading-relaxed italic">
                {order.notes || "Sin instrucciones adicionales."}
              </p>
            </div>
          </section>
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-medium text-gray-900 mb-8">
            Estado de tu entrega
          </h2>

          <div className="border-l border-gray-200 ml-1.5 pl-10 space-y-12 relative">
            <MilestoneContainer
              title="El pedido fue creado existosamente"
              date={formatDate(order.created_at)}
              description="Hemos recibido tu solicitud."
            />

            {(order.driver_id || order.assigned_at) && (
              <>
                <MilestoneContainer
                  title="Pedido asignado a chofer"
                  date={formatDate(order.assigned_at || order.created_at)}
                  description="Tu paquete ya tiene un chofer asignado."
                />
                <MilestoneContainer
                  title="Pedido en preparación"
                  date={formatDate(order.assigned_at || order.created_at)}
                  description="Preparando ruta de entrega."
                />
              </>
            )}

            {order.in_transit_at && (
              <MilestoneContainer
                title="Pedido en camino"
                date={formatDate(order.in_transit_at)}
                description="El repartidor se dirige a tu ubicación."
              />
            )}

            {order.completed_at && (
              <MilestoneContainer
                title="Pedido entregado"
                date={formatDate(order.completed_at)}
                description="¡Paquete entregado con éxito!"
              />
            )}

            {order.cancelled_at && (
              <MilestoneContainer
                title="Pedido cancelado"
                date={formatDate(order.cancelled_at)}
                description="Tu pedido no pudo ser entregado."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
