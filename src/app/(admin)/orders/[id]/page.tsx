"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  RiArrowLeftLine,
  RiLoader4Line,
  RiEditLine,
  RiCheckLine,
} from "@remixicon/react";
import { Divider } from "@/components/ui/Divider";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/Dialog";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { formatters } from "@/lib/utils";
import { Textarea } from "@/components/ui/Textarea";
import { RowOrderData } from "@/components/orders/RowOrderData";
import { MilestoneContainer } from "@/components/orders/MilestoneContainer";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  pending: ["collecting", "cancelled"],
  collecting: ["in_transit", "cancelled"],
  in_transit: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [notes, setNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [publicTrackingUrl, setPublicTrackingUrl] = useState<string>("");

  const [isOpenCancelDialog, setIsOpenCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && id) {
      fetchOrderDetails();
    }
  }, [id, mounted]);

  async function fetchOrderDetails() {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select(
          `
          *,
          clients (full_name, phone),
          branches (name),
          profiles:driver_id (full_name)
        `,
        )
        .eq("id", id)
        .single();

      if (orderError) throw orderError;

      const { data: historyData, error: historyError } = await supabase
        .from("order_status_history")
        .select("*")
        .eq("order_id", id)
        .order("created_at", { ascending: false });

      if (historyError) throw historyError;

      setOrder(orderData);
      setHistory(historyData);
      setNotes(orderData.notes || "");
    } catch (error: any) {
      console.error(error);
      toast.error("No se encontró el pedido");
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (date: string) =>
    format(new Date(date), "dd MMMM, yyyy - HH:mm'h'", { locale: es });

  // Mediador de cambios de estatus
  const onStatusChangeRequest = (newStatus: string) => {
    if (newStatus === "cancelled") {
      setIsOpenCancelDialog(true);
    } else {
      handleUpdateStatus(newStatus);
    }
  };

  async function handleUpdateStatus(newStatus: string, reason?: string) {
    const allowed =
      ALLOWED_TRANSITIONS[order.status as keyof typeof ALLOWED_TRANSITIONS];

    if (!allowed?.includes(newStatus) && newStatus !== order.status) {
      toast.error(`Transición no permitida de ${order.status} a ${newStatus}`);
      return;
    }

    if (
      (newStatus === "collecting" || newStatus === "in_transit") &&
      !order.driver_id
    ) {
      toast.error("Debes asignar un chofer antes de cambiar el estatus.");
      return;
    }

    setUpdating(true);
    try {
      const now = new Date().toISOString();
      const updatePayload: any = { status: newStatus };

      if (newStatus === "collecting") updatePayload.picked_up_at = now;
      if (newStatus === "in_transit") updatePayload.in_transit_at = now;
      if (newStatus === "completed") updatePayload.completed_at = now;
      if (newStatus === "cancelled") {
        updatePayload.cancelled_at = now;
        updatePayload.cancellation_reason = reason;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      await Promise.all([
        supabase.from("orders").update(updatePayload).eq("id", id),
        supabase.from("order_status_history").insert({
          order_id: id,
          status: newStatus,
          changed_by: user?.id,
          notes: reason || `Estatus actualizado a ${newStatus}`,
        }),
      ]);

      toast.success("Estatus actualizado correctamente");
      setIsOpenCancelDialog(false);
      router.refresh();
      fetchOrderDetails();
    } catch (error) {
      toast.error("Error al actualizar");
    } finally {
      setUpdating(false);
    }
  }

  async function handleSaveNotes() {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ notes: notes })
        .eq("id", id);

      if (error) throw error;
      setOrder((prev: any) => ({
        ...prev,
        notes: notes,
      }));
      toast.success("Notas guardadas");
      setIsEditingNotes(false);
    } catch (error) {
      toast.error("Error al guardar");
    } finally {
      setUpdating(false);
    }
  }

  useEffect(() => {
    if (!mounted) return;

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
      window.location.origin;

    if (order?.tracking_token) {
      setPublicTrackingUrl(`${baseUrl}/track/${order.tracking_token}`);
    } else {
      setPublicTrackingUrl("");
    }
  }, [mounted, order?.tracking_token]);

  async function handleCopyTrackingLink() {
    if (!publicTrackingUrl) {
      toast.error("Este pedido no tiene token de rastreo");
      return;
    }

    try {
      await navigator.clipboard.writeText(publicTrackingUrl);
      toast.success("Link copiado al portapapeles");
    } catch {
      toast.error("No se pudo copiar el link");
    }
  }

  function handleOpenTrackingLink() {
    if (!publicTrackingUrl) {
      toast.error("Este pedido no tiene token de rastreo");
      return;
    }
    window.open(publicTrackingUrl, "_blank", "noopener,noreferrer");
  }

  if (!mounted) return null;
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-geist">
        <RiLoader4Line className="size-6 animate-spin text-gray-400" />
      </div>
    );
  }
  if (!order) return null;

  return (
    <div className="font-geist pb-20 p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-10 cursor-pointer"
      >
        <RiArrowLeftLine className="size-4" />
        Regresar a la lista
      </button>

      <div className="flex flex-col">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-medium text-gray-900 tracking-tight">
              Pedido #{order.order_number}
            </h1>
            <p className="text-sm text-gray-600">Folio: {order.id}</p>
          </div>

          <div className="flex items-center gap-4">
            <Select
              value={order.status}
              onValueChange={onStatusChangeRequest}
              disabled={updating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="pending"
                  disabled={
                    !ALLOWED_TRANSITIONS.pending.includes("pending") &&
                    order.status !== "pending"
                  }
                >
                  Pendiente
                </SelectItem>
                <SelectItem
                  value="collecting"
                  disabled={
                    !ALLOWED_TRANSITIONS[order.status]?.includes(
                      "collecting",
                    ) && order.status !== "collecting"
                  }
                >
                  En recolección
                </SelectItem>
                <SelectItem
                  value="in_transit"
                  disabled={
                    !ALLOWED_TRANSITIONS[order.status]?.includes(
                      "in_transit",
                    ) && order.status !== "in_transit"
                  }
                >
                  En tránsito
                </SelectItem>
                <SelectItem
                  value="completed"
                  disabled={
                    !ALLOWED_TRANSITIONS[order.status]?.includes("completed") &&
                    order.status !== "completed"
                  }
                >
                  Completado
                </SelectItem>
                <SelectItem
                  value="cancelled"
                  disabled={
                    !ALLOWED_TRANSITIONS[order.status]?.includes("cancelled") &&
                    order.status !== "cancelled"
                  }
                >
                  Cancelado
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Divider className="my-6 " />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          {/* Información */}
          <div className="space-y-12">
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-8">
                Información General
              </h2>
              <div className="space-y-4">
                <RowOrderData
                  title="Cliente / Destino"
                  description={order.clients?.full_name}
                />
                <RowOrderData
                  title="Sucursal de Origen"
                  description={order.branches?.name}
                />
                <RowOrderData
                  title="Operador asignado"
                  description={order.profiles?.full_name || "Sin asignar"}
                />
                <RowOrderData
                  title="Valor de mercancía"
                  description={formatters.currency(order.merchandise_value)}
                />
                <RowOrderData
                  title="Fecha programada"
                  description={
                    order.scheduled_at
                      ? formatDate(order.scheduled_at)
                      : "No programada"
                  }
                />
                <RowOrderData
                  title="Distancia"
                  description={
                    order.distance_km ? `${order.distance_km} km` : "0 km"
                  }
                />
                <RowOrderData
                  title="Cargo Naveo"
                  description={formatters.currency(order.software_fee || 0)}
                />
                <RowOrderData
                  title="Estatus del pago"
                  description={
                    order.payment_status === "paid" ? "Pagado" : "Pendiente"
                  }
                />
                <RowOrderData
                  title="Método de cobro"
                  description={
                    order.payment_method === "cash" ? "Efectivo" : "Tarjeta"
                  }
                />
                <RowOrderData
                  title="Token de rastreo"
                  description={order.tracking_token}
                />
                <section>
                  <h2 className="text-sm font-medium text-gray-600 mb-6">
                    Link público de rastreo
                  </h2>

                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 mb-1">URL</p>

                          {publicTrackingUrl ? (
                            <a
                              href={publicTrackingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-700 break-all"
                            >
                              {publicTrackingUrl}
                            </a>
                          ) : (
                            <p className="text-sm text-gray-500">
                              No disponible
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="secondary"
                          className="shadow-none cursor-pointer"
                          onClick={handleOpenTrackingLink}
                          disabled={!publicTrackingUrl || updating}
                        >
                          Abrir link
                        </Button>

                        <Button
                          className="shadow-none cursor-pointer"
                          onClick={handleCopyTrackingLink}
                          disabled={!publicTrackingUrl || updating}
                        >
                          Copiar link
                        </Button>
                      </div>

                      <p className="text-xs text-gray-500">
                        Comparte este link con el cliente para consultar el
                        estatus del envío.
                      </p>
                    </div>
                  </div>
                </section>

                <RowOrderData
                  title="Nombre de quien recibe"
                  description={order.received_by_name || "No registrado"}
                />
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-medium text-gray-600">
                  Observaciones
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setIsEditingNotes(!isEditingNotes)}
                  className="text-xs text-blue-600 cursor-pointer flex items-center gap-1"
                >
                  <RiEditLine className="size-3" />
                  Editar notas
                </Button>
              </div>
              {isEditingNotes ? (
                <div className="space-y-4">
                  <Textarea
                    className="resize-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="secondary"
                      className="cursor-pointer shadow-none"
                      onClick={() => setIsEditingNotes(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="cursor-pointer shadow-none"
                      onClick={handleSaveNotes}
                      disabled={updating}
                    >
                      <RiCheckLine className="size-4 mr-2" /> Guardar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-gray-50 border-l-2 border-gray-200">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {order.notes || "Sin observaciones."}
                  </p>
                </div>
              )}
            </section>

            {order.status === "cancelled" && (
              <section>
                <h2 className="text-sm font-medium text-red-600 mb-6 uppercase tracking-wider">
                  Motivo de cancelación
                </h2>
                <div className="p-6 bg-red-50 border-l-2 border-red-200">
                  <p className="text-sm text-red-800 whitespace-pre-wrap">
                    {order.cancellation_reason || "No se especificó un motivo."}
                  </p>
                </div>
              </section>
            )}

            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-8">
                Evidencia de entrega
              </h2>

              {order.signature_url ? (
                <div className="space-y-3">
                  <div className="rounded-2xl border border-gray-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium text-gray-900">
                          Foto de evidencia
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.evidence_uploaded_at
                            ? `Subida: ${formatDate(
                                order.evidence_uploaded_at,
                              )}`
                            : "Subida: (sin fecha)"}
                        </p>
                      </div>

                      <a
                        href={order.signature_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Abrir en nueva pestaña
                      </a>
                    </div>

                    <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      <img
                        src={order.signature_url}
                        alt={`Evidencia de entrega del pedido #${order.order_number}`}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border-l-2 border-gray-200">
                    <p className="text-sm text-gray-600">
                      {order.received_by_name
                        ? `Recibió: ${order.received_by_name}`
                        : "Recibió: (no registrado)"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-gray-50 border-l-2 border-gray-200">
                  <p className="text-sm text-gray-600">
                    No se registró evidencia.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Registro de Actividad */}
          <div className="flex flex-col">
            <h2 className="text-lg font-medium text-gray-900 mb-8">
              Registro de Actividad
            </h2>
            <div className="border-l border-gray-200 ml-1.5 pl-10 space-y-12 relative">
              <MilestoneContainer
                title="El pedido fue creado existosamente"
                date={formatDate(order.created_at)}
                description={`Folio: ${order.id}`}
              />

              {order.picked_up_at && (
                <MilestoneContainer
                  title="En recolección"
                  date={formatDate(order.picked_up_at)}
                  description={`El chofer ${order.profiles?.full_name} está recolectando en ${order.branches?.name}.`}
                />
              )}
              {order.in_transit_at && (
                <MilestoneContainer
                  title="Pedido en camino"
                  date={formatDate(order.in_transit_at)}
                  description={`Salió de ${order.branches?.name}.`}
                />
              )}
              {order.completed_at && (
                <MilestoneContainer
                  title="Pedido entregado"
                  date={formatDate(order.completed_at)}
                  description={
                    order.received_by_name
                      ? `Recibió: ${order.received_by_name}`
                      : "Entregado exitosamente."
                  }
                />
              )}

              {order.cancelled_at && (
                <MilestoneContainer
                  title="Pedido cancelado"
                  date={formatDate(order.cancelled_at)}
                  description={`Motivo: ${order.cancellation_reason}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DIÁLOGO DE CANCELACIÓN */}
      <Dialog
        open={isOpenCancelDialog}
        onOpenChange={(open) => {
          if (!updating) setIsOpenCancelDialog(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-900 flex items-center gap-2">
              Confirmar Cancelación
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-2">
            <p className="text-sm text-gray-600">
              Por favor, indica el motivo de la cancelación. Esta acción es
              irreversible.
            </p>
            <Textarea
              className=" shadow-none min-h-24 bg-gray-50 focus:bg-white transition-all resize-none"
              placeholder="Ej. El cliente no se encontraba en el domicilio..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>
          <DialogFooter className="flex items-center gap-3">
            <Button
              variant="secondary"
              className=" shadow-none flex-1 cursor-pointer"
              onClick={() => {
                setIsOpenCancelDialog(false);
                setCancelReason("");
              }}
              disabled={updating}
            >
              Cancelar
            </Button>
            <Button
              className=" shadow-none flex-1 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              onClick={() => handleUpdateStatus("cancelled", cancelReason)}
              disabled={updating || !cancelReason.trim()}
            >
              {updating ? (
                <RiLoader4Line className="animate-spin size-4" />
              ) : (
                "Confirmar cancelación"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
