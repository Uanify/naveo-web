"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { ArrowUpRight, Copy, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

type OrderStatus =
  | "new"
  | "queued"
  | "assigned_to_batch"
  | "sent_to_driver"
  | "accepted"
  | "rejected_by_driver"
  | "collecting"
  | "collected"
  | "in_transit"
  | "delivered"
  | "undelivered";

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Nuevo",
  queued: "En cola",
  assigned_to_batch: "Asignado a lote",
  sent_to_driver: "Enviado a chofer",
  accepted: "Aceptado",
  rejected_by_driver: "Rechazado por chofer",
  collecting: "Recolección",
  collected: "Recogido",
  in_transit: "En tránsito",
  delivered: "Entregado",
  undelivered: "No entregado",
};

type QueueRowMock = {
  id: string;
  created_at: string;
  order_number: number;
  external_id: string;
  minutes_in_queue: number;
  priority_label: "Baja" | "Media" | "Alta" | "Urgente";
  priority_dot: "bg-gray-400" | "bg-yellow-500" | "bg-red-500" | "bg-rose-600";
  status: OrderStatus;
  is_ready_for_batch?: boolean;
  client_name: string;
  value_mxn: string;
  items_count: number;
  batch_id?: string | null;
};

function safePrettyJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "{}";
  }
}

export function QueueTableWithRowModal({
  rows,
  columns,
  thresholdMinutes,
}: {
  rows: QueueRowMock[];
  columns: string;
  thresholdMinutes: number;
}) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<QueueRowMock | null>(null);

  const openRow = (row: QueueRowMock) => {
    console.log(row);
    setSelected(row);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setSelected(null);
  };

  return (
    <>
      {rows.map((row) => (
        <div
          key={row.id}
          tabIndex={0}
          onClick={() => openRow(row)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openRow(row);
          }}
          className={twMerge(
            `grid ${columns} w-full min-w-[1280px] pr-20 mb-1 items-center mx-1 rounded-sm py-1 px-2 text-xs text-gray-600 font-mono [&_p]:font-mono [&_a]:font-mono`,
            "bg-[#F7F7F7] hover:bg-[#EFEFEF] cursor-pointer select-none",
          )}
        >
          <p className="text-left">{row.created_at}</p>

          <p className="text-left truncate">
            #{row.order_number} • {row.external_id}
          </p>

          <p
            className={twMerge(
              "text-left",
              row.minutes_in_queue > thresholdMinutes &&
                "text-red-500 font-semibold",
            )}
          >
            {row.minutes_in_queue} min.
          </p>

          <p className="text-left flex items-center gap-1 truncate">
            {STATUS_LABELS[row.status] ?? "—"}
          </p>

          <p className="text-left truncate">{row.client_name}</p>
          <p className="text-left">{row.value_mxn}</p>
          <p className="text-left">{row.items_count}</p>
          <p className="text-left">{row.batch_id || "—"}</p>
        </div>
      ))}

      {/* Modal */}
      <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : close())}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>Detalle de Pedido</DialogTitle>
          {/* JSON */}
          <pre className="mt-3 max-h-[420px] overflow-auto rounded-md border bg-white p-3 text-xs text-gray-700">
            {safePrettyJson(selected ?? {})}
          </pre>
        </DialogContent>
      </Dialog>
    </>
  );
}
