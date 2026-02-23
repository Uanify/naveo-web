import { BatchStatus } from "@/types/batch";

export const BATCH_STATUS_LABELS: Record<BatchStatus, string> = {
  assigned: "Asignado",
  sent_to_driver: "Enviado a chofer",
  accepted: "Aceptado",
  partially_accepted: "Aceptado parcial",
  rejected: "Rechazado",
  decomposed: "Descompuesto",
  in_progress: "En progreso",
  completed: "Completado",
  cancelled: "Cancelado",
};

export const BATCH_STATUS_DOT: Record<
  BatchStatus,
  { dot: string; bg: string }
> = {
  assigned: {
    dot: "bg-indigo-500",
    bg: "bg-indigo-500/20",
  },
  sent_to_driver: {
    dot: "bg-yellow-500",
    bg: "bg-yellow-500/20",
  },
  accepted: {
    dot: "bg-green-600",
    bg: "bg-green-600/20",
  },
  partially_accepted: {
    dot: "bg-green-500",
    bg: "bg-green-500/20",
  },
  rejected: {
    dot: "bg-red-500",
    bg: "bg-red-500/20",
  },
  decomposed: {
    dot: "bg-rose-600",
    bg: "bg-rose-600/20",
  },
  in_progress: {
    dot: "bg-amber-500",
    bg: "bg-amber-500/20",
  },
  completed: {
    dot: "bg-emerald-700",
    bg: "bg-emerald-700/20",
  },
  cancelled: {
    dot: "bg-red-500",
    bg: "bg-red-500/20",
  },
};
