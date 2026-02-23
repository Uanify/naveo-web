import { OrderStatus } from "@/types/orders";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendiente",
  new: "Nuevo",
  queued: "En cola",
  assigned_to_batch: "Asignado a lote",
  sent_to_driver: "Enviado a chofer",
  accepted: "Aceptado",
  rejected_by_driver: "Rechazado por chofer",
  collecting: "Recogiendo",
  collected: "Recogido",
  in_transit: "En tránsito",
  delivered: "Entregado",
  undelivered: "No entregado",
};

export const ORDER_STATUS_DOT: Record<
  OrderStatus,
  { dot: string; bg: string }
> = {
  pending: {
    dot: "bg-indigo-500",
    bg: "bg-indigo-500/20",
  },
  new: {
    dot: "bg-yellow-500",
    bg: "bg-yellow-500/20",
  },
  queued: {
    dot: "bg-gray-600",
    bg: "bg-gray-600/20",
  },
  assigned_to_batch: {
    dot: "bg-indigo-500",
    bg: "bg-indigo-500/20",
  },
  sent_to_driver: {
    dot: "bg-orange-500",
    bg: "bg-orange-500/20",
  },
  accepted: {
    dot: "bg-blue-600",
    bg: "bg-blue-600/20",
  },
  rejected_by_driver: {
    dot: "bg-rose-500",
    bg: "bg-rose-500/20",
  },
  collecting: {
    dot: "bg-yellow-600",
    bg: "bg-yellow-600/20",
  },
  collected: {
    dot: "bg-purple-500",
    bg: "bg-purple-500/20",
  },
  in_transit: {
    dot: "bg-blue-500",
    bg: "bg-blue-500/20",
  },
  delivered: {
    dot: "bg-emerald-600",
    bg: "bg-emerald-600/20",
  },
  undelivered: {
    dot: "bg-red-500",
    bg: "bg-red-500/20",
  },
};
