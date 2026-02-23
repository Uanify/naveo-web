"use client";

import * as React from "react";
import {
  AlarmClock,
  Blocks,
  ClockAlert,
  RefreshCcw,
  UserLock,
  ArrowUpRight,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { QUEUE_ROWS_MOCK } from "@/mocks/incoming-orders";
import { QueueTableWithRowModal } from "./QueueTableWithRowModal";
import { useState } from "react";

type ApiDirectionTabDraft = {
  threshold_minutes: number;
  driver_response_timeout_minutes: number;
  max_orders_per_batch: number;
  driver_block_duration_minutes: number;
};

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

function getStatusUI(status: OrderStatus, isReadyForBatch?: boolean) {
  // If you want the "in-between" state for debugging WITHOUT adding a DB status:
  if (status === "queued" && isReadyForBatch) {
    return { label: "Listo para lote", dot: "bg-amber-500" };
  }

  switch (status) {
    case "new":
      return { label: "Nuevo", dot: "bg-slate-400" };
    case "queued":
      return { label: "En cola", dot: "bg-blue-500" };
    case "assigned_to_batch":
      return { label: "En lote", dot: "bg-indigo-500" };
    case "sent_to_driver":
      return { label: "Enviado a chofer", dot: "bg-violet-500" };
    case "accepted":
      return { label: "Aceptado", dot: "bg-emerald-500" };
    case "rejected_by_driver":
      return { label: "Rechazado", dot: "bg-rose-500" };
    case "collecting":
      return { label: "Recolectando", dot: "bg-cyan-500" };
    case "collected":
      return { label: "Recolectado", dot: "bg-teal-500" };
    case "in_transit":
      return { label: "En tránsito", dot: "bg-yellow-500" };
    case "delivered":
      return { label: "Entregado", dot: "bg-green-600" };
    case "undelivered":
      return { label: "No entregado", dot: "bg-orange-600" };
    default:
      return { label: status, dot: "bg-gray-400" };
  }
}

function clampInt(value: number, min: number, max: number) {
  return Math.min(Math.max(Math.trunc(value), min), max);
}

function toInt(value: string, fallback: number) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

export function ApiDirectTab() {
  // UI-only draft values (no integrations yet)
  const [draft, setDraft] = useState<ApiDirectionTabDraft>({
    threshold_minutes: 10,
    driver_response_timeout_minutes: 5,
    max_orders_per_batch: 5,
    driver_block_duration_minutes: 10,
  });

  const columns = "grid-cols-[180px_200px_90px_180px_180px_110px_70px_1fr]";

  return (
    <section className="h-[calc(100vh-36px)] w-[calc(100%-400px)] ">
      <div className="flex h-[39px] w-full items-center justify-end border-b py-0.5 px-2 bg-[#F7F7F7] ">
        <div className="flex items-center gap-2 ">
          {/* Threshold */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="cursor-pointer px-1.5 py-1 text-xs flex items-center gap-1"
              >
                <AlarmClock strokeWidth={1.3} size={14} />
                Umbral
                <span className="ml-1 rounded-md border bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  {draft.threshold_minutes}m
                </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-72 p-3">
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Umbral (min)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tiempo máximo en espera antes de forzar decisión del
                    dispatcher.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-8 px-2"
                    onClick={() =>
                      setDraft((p) => ({
                        ...p,
                        threshold_minutes: clampInt(
                          p.threshold_minutes - 1,
                          1,
                          180,
                        ),
                      }))
                    }
                  >
                    -
                  </Button>

                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={180}
                    value={draft.threshold_minutes}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        threshold_minutes: clampInt(
                          toInt(e.target.value, p.threshold_minutes),
                          1,
                          180,
                        ),
                      }))
                    }
                    className="h-8"
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    className="h-8 px-2"
                    onClick={() =>
                      setDraft((p) => ({
                        ...p,
                        threshold_minutes: clampInt(
                          p.threshold_minutes + 1,
                          1,
                          180,
                        ),
                      }))
                    }
                  >
                    +
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Driver response timeout */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="cursor-pointer px-1.5 py-1 text-xs flex items-center gap-1"
              >
                <ClockAlert strokeWidth={1.3} size={14} />
                Timeout chofer
                <span className="ml-1 rounded-md border bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  {draft.driver_response_timeout_minutes}m
                </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-72 p-3">
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Timeout chofer (min)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tiempo máximo para que el chofer acepte/rechace un lote
                    ofrecido.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-8 px-2"
                    onClick={() =>
                      setDraft((p) => ({
                        ...p,
                        driver_response_timeout_minutes: clampInt(
                          p.driver_response_timeout_minutes - 1,
                          1,
                          60,
                        ),
                      }))
                    }
                  >
                    -
                  </Button>

                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={60}
                    value={draft.driver_response_timeout_minutes}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        driver_response_timeout_minutes: clampInt(
                          toInt(
                            e.target.value,
                            p.driver_response_timeout_minutes,
                          ),
                          1,
                          60,
                        ),
                      }))
                    }
                    className="h-8"
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    className="h-8 px-2"
                    onClick={() =>
                      setDraft((p) => ({
                        ...p,
                        driver_response_timeout_minutes: clampInt(
                          p.driver_response_timeout_minutes + 1,
                          1,
                          60,
                        ),
                      }))
                    }
                  >
                    +
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Max orders per batch */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="cursor-pointer px-1.5 py-1 text-xs flex items-center gap-1"
              >
                <Blocks strokeWidth={1.3} size={14} />
                Pedidos por lote
                <span className="ml-1 rounded-md border bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  {draft.max_orders_per_batch}
                </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-72 p-3">
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Máx. pedidos por lote
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Cap máximo de pedidos dentro de un batch.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-8 px-2"
                    onClick={() =>
                      setDraft((p) => ({
                        ...p,
                        max_orders_per_batch: clampInt(
                          p.max_orders_per_batch - 1,
                          1,
                          20,
                        ),
                      }))
                    }
                  >
                    -
                  </Button>

                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={20}
                    value={draft.max_orders_per_batch}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        max_orders_per_batch: clampInt(
                          toInt(e.target.value, p.max_orders_per_batch),
                          1,
                          20,
                        ),
                      }))
                    }
                    className="h-8"
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    className="h-8 px-2"
                    onClick={() =>
                      setDraft((p) => ({
                        ...p,
                        max_orders_per_batch: clampInt(
                          p.max_orders_per_batch + 1,
                          1,
                          20,
                        ),
                      }))
                    }
                  >
                    +
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Driver block duration */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="cursor-pointer px-1.5 py-1 text-xs flex items-center gap-1"
              >
                <UserLock strokeWidth={1.3} size={14} />
                Bloqueo chofer
                <span className="ml-1 rounded-md border bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground">
                  {draft.driver_block_duration_minutes}m
                </span>
              </Button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-72 p-3">
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Bloqueo chofer (min)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tiempo de bloqueo temporal tras rechazo/timeout (según tu
                    lógica).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-8 px-2"
                    onClick={() =>
                      setDraft((p) => ({
                        ...p,
                        driver_block_duration_minutes: clampInt(
                          p.driver_block_duration_minutes - 1,
                          1,
                          180,
                        ),
                      }))
                    }
                  >
                    -
                  </Button>

                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={180}
                    value={draft.driver_block_duration_minutes}
                    onChange={(e) =>
                      setDraft((p) => ({
                        ...p,
                        driver_block_duration_minutes: clampInt(
                          toInt(
                            e.target.value,
                            p.driver_block_duration_minutes,
                          ),
                          1,
                          180,
                        ),
                      }))
                    }
                    className="h-8"
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    className="h-8 px-2"
                    onClick={() =>
                      setDraft((p) => ({
                        ...p,
                        driver_block_duration_minutes: clampInt(
                          p.driver_block_duration_minutes + 1,
                          1,
                          180,
                        ),
                      }))
                    }
                  >
                    +
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Refresh (UI only) */}
          <Button
            type="button"
            variant="ghost"
            className="cursor-pointer text-xs px-1.5 py-1 flex items-center gap-1"
            onClick={() => {
              // UI-only placeholder

              console.log("Refresh clicked (no integrations yet)");
            }}
          >
            <RefreshCcw strokeWidth={1.3} size={14} />
          </Button>
        </div>
      </div>

      <div className="h-[calc(100%-39px)] w-full overflow-y-scroll">
        {/* Header */}
        <div
          className={twMerge(
            "w-full min-w-[1280px] border-b items-center py-1 px-3 pr-16 mb-2",
            `grid ${columns}`,
          )}
        >
          <p className="text-xs text-gray-600 font-medium text-left">Hora</p>
          <p className="text-xs text-gray-600 font-medium text-left">Pedido</p>
          <p className="text-xs text-gray-600 font-medium text-left">
            Min. cola
          </p>
          <p className="text-xs text-gray-600 font-medium text-left">Estatus</p>
          <p className="text-xs text-gray-600 font-medium text-left">Cliente</p>
          <p className="text-xs text-gray-600 font-medium text-left">Valor</p>
          <p className="text-xs text-gray-600 font-medium text-left">Items</p>
          <p className="text-xs text-gray-600 font-medium text-left">Lote</p>
        </div>
        <QueueTableWithRowModal
          rows={QUEUE_ROWS_MOCK}
          columns={columns}
          thresholdMinutes={draft.threshold_minutes}
        />
      </div>
    </section>
  );
}
