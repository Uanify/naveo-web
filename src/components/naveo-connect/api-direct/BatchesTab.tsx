"use client";

import { twMerge } from "tailwind-merge";
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  EllipsisVertical,
  Info,
  Package,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { BATCHES_MOCK } from "@/mocks/batch-mocks";
import {
  BatchStatus,
} from "@/types/batch";
import { BATCH_STATUS_DOT, BATCH_STATUS_LABELS } from "@/enums/batch";
import { ORDER_STATUS_DOT, ORDER_STATUS_LABELS } from "@/enums/orders";

function formatStatusPill(status: BatchStatus) {
  const dot = BATCH_STATUS_DOT[status] ?? "bg-gray-400";
  const label = BATCH_STATUS_LABELS[status] ?? status;

  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className={twMerge("size-1.5 rounded-full", dot.dot)} />
      <p className="truncate">{label}</p>
    </div>
  );
}

export default function BatchesTab() {
  // Layout: left list + right detail
  const [selectedId, setSelectedId] = useState<string>(BATCHES_MOCK[0]?.id);
  const selected = useMemo(
    () => BATCHES_MOCK.find((b) => b.id === selectedId) ?? null,
    [selectedId],
  );

  const listColumns = "grid-cols-[190px_230px_160px_140px_120px_220px_1fr]"; // batch rows

  return (
    <div className="flex h-[calc(100vh-36px)] w-full min-w-0">
      {/* LEFT: batches list */}
      <section className="h-full w-[700px] border-r bg-white overflow-y-auto min-w-0">
        {/* Header */}
        <div
          className={twMerge(
            "w-full min-w-fit border-b items-center py-1 px-3 pr-6 mb-2 sticky top-0 bg-white z-10",
            `grid ${listColumns}`,
          )}
        >
          <p className="text-xs text-gray-600 font-medium text-left">Creado</p>
          <p className="text-xs text-gray-600 font-medium text-left">Batch</p>
          <p className="text-xs text-gray-600 font-medium text-left">Estatus</p>
          <p className="text-xs text-gray-600 font-medium text-left">Zona</p>
          <p className="text-xs text-gray-600 font-medium text-left">Pedidos</p>
          <p className="text-xs text-gray-600 font-medium text-left">Chofer</p>
          <p className="text-xs text-gray-600 font-medium text-left">Valor</p>
        </div>

        {/* Rows */}
        <div className="pb-2">
          {BATCHES_MOCK.map((b) => {
            const isSelected = b.id === selectedId;

            return (
              <div
                key={b.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId(b.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedId(b.id);
                }}
                className={twMerge(
                  `grid ${listColumns} min-w-fit mb-1 items-center mx-1 rounded-sm py-1 px-2 text-xs text-gray-600 font-mono [&_p]:font-mono`,
                  "cursor-pointer select-none bg-[#F7F7F7] hover:bg-[#EFEFEF]",
                  isSelected && "ring-1 ring-gray-300 bg-[#EFEFEF]",
                )}
              >
                <p className="text-left">{b.created_at}</p>

                <p>{b.id}</p>

                <div className="text-left truncate">
                  {formatStatusPill(b.status)}
                </div>
                <p className="text-left truncate">{b.zone_name ?? "—"}</p>
                <p className="text-left">{b.order_count}</p>

                <p className="text-left truncate">
                  {b.assigned_driver_name ?? "—"}
                </p>

                <p className="text-left">{b.total_value_mxn}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* RIGHT: batch detail */}
      <section className="h-full flex-1 min-w-0 bg-white overflow-y-auto">
        <div className="flex items-center px-2 py-1 border-b">
          <Button
            variant="ghost"
            className="cursor-pointer px-1.5 py-1 text-xs flex items-center gap-1"
          >
            <CheckCircle strokeWidth={1.3} size={12} />
            Aceptar todo
          </Button>
          <Button
            variant="ghost"
            className="cursor-pointer px-1.5 py-1 text-xs flex items-center gap-1"
          >
            <X strokeWidth={1.3} size={12} />
            Rechazar todo
          </Button>
        </div>
        <div className="px-2 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Calendar strokeWidth={1.3} size={12} />
              <p className="text-xs text-gray-600 text-left">
                Creado el {selected?.created_at}
              </p>
            </div>
            <div className="flex items-center">
              <div className="border rounded-l-sm w-fit px-2 py-0.5 text-[13px] font-medium text-gray-800">
                {selected?.status && BATCH_STATUS_LABELS[selected?.status]}
              </div>
              <button className="border-r border-y size-[25.5px] flex cursor-pointer hover:bg-gray-100 items-center justify-center rounded-r-sm">
                <EllipsisVertical strokeWidth={1.3} size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 py-3">
            <div
              className={twMerge(
                "size-4 rounded-full flex items-center justify-center",
                selected?.status && BATCH_STATUS_DOT[selected?.status].bg,
              )}
            >
              <div
                className={twMerge(
                  "size-2 rounded-full opacity-100",
                  selected?.status && BATCH_STATUS_DOT[selected?.status].dot,
                )}
              />
            </div>
            <h3 className="text-base font-semibold">{selected?.id}</h3>
          </div>

          <div className="flex flex-col gap-2 border-t">
            <button className="flex py-2 mt-2 items-center px-3 justify-between cursor-pointer hover:bg-gray-100 rounded-sm">
              <div className="flex items-center gap-2">
                <Info strokeWidth={1.3} size={12} />
                <p className="text-xs text-gray-600">Información del batch</p>
              </div>
              <ChevronDown strokeWidth={1.3} size={14} />
            </button>

            <div className="grid grid-cols-2 gap-4 px-3">
              <div>
                <p className="text-xs text-gray-600">Zona</p>
                <p className="text-sm text-gray-900 font-medium">
                  {selected?.zone_name ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Contador orden</p>
                <p className="text-sm text-gray-900 font-medium">
                  {selected?.order_count ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Valor del lote</p>
                <p className="text-sm text-gray-900 font-medium">
                  {selected?.total_value_mxn ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">
                  Nombre de conductor asignado
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {selected?.assigned_driver_name ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">ID de conductor</p>
                <p className="text-sm text-gray-900 font-medium">
                  {selected?.assigned_driver_id ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Enviado al conductor</p>
                <p className="text-sm text-gray-900 font-medium">
                  {selected?.sent_to_driver_at ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Tiempo de respuesta</p>
                <p className="text-sm text-gray-900 font-medium">
                  {selected?.response_timeout_at ?? "-"}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col border-t mt-4">
            <button className="flex py-2 mt-2 items-center px-3 justify-between cursor-pointer hover:bg-gray-100 rounded-sm">
              <div className="flex items-center gap-2">
                <Package strokeWidth={1.3} size={12} />
                <p className="text-xs text-gray-600">Información de pedidos</p>
              </div>
              <ChevronDown strokeWidth={1.3} size={14} />
            </button>

            <div className="flex flex-col">
              {selected?.orders?.map((order) => (
                <div className="p-4 relative" key={order.id}>
                  <div className="mb-5 flex justify-between items-center">
                    <div className="absolute top-10 left-6 h-full w-px bg-gray-300" />
                    <div className="flex items-center gap-3">
                      <div
                        className={twMerge(
                          "size-4 rounded-full flex items-center justify-center",
                          ORDER_STATUS_DOT[order.status].bg,
                        )}
                      >
                        <div
                          className={twMerge(
                            "size-2 rounded-full",
                            ORDER_STATUS_DOT[order.status].dot,
                          )}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{order?.id}</p>
                        <p className="text-xs text-gray-600">
                          {order?.created_at}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="border rounded-l-sm w-fit px-2 py-0.5 text-[13px] font-medium text-gray-800">
                        {order?.status && ORDER_STATUS_LABELS[order?.status]}
                      </div>
                      <button className="border-r border-y size-[25.5px] flex cursor-pointer hover:bg-gray-100 items-center justify-center rounded-r-sm">
                        <EllipsisVertical strokeWidth={1.3} size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 ml-6">
                    <div>
                      <p className="text-xs text-gray-600">Número de orden</p>
                      <p className="text-sm text-gray-900 font-medium">
                        {order?.order_number ?? "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">ID externo</p>
                      <p className="text-sm text-gray-900 font-medium">
                        {order?.external_id ?? "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Nombre de cliente</p>
                      <p className="text-sm text-gray-900 font-medium">
                        {order?.client_name ?? "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">
                        Dirección de envío
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {order?.client_address ?? "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">
                        Cantidad de productos
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {order?.items_count ?? "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">
                        Valor de mercancía
                      </p>
                      <p className="text-sm text-gray-900 font-medium">
                        {order?.merchandise_value_mxn ?? "-"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
