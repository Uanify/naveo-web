"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import {
  RiCarLine,
  RiPhoneLine,
  RiTimeLine,
  RiCalendarLine,
  RiMapPinRangeLine,
} from "@remixicon/react";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { DataTableRowActions } from "../DataTableRowActions";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";

export type DriverStub = {
  id: string;
  full_name: string;
  phone: string | null;
  role: string;
  vehicle_plate: string | null;
  email?: string;
  status: {
    label: string;
    color: "default" | "neutral" | "success" | "error" | "warning";
    info: string;
    hasOrders: boolean;
  };
  raw_orders: any[];
};

const columnHelper = createColumnHelper<DriverStub>();

const DriverStatusCell = ({ row, getValue }: any) => {
  const status = getValue();
  const driver = row.original;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-row items-center gap-1">
      <Badge className="w-fit h-fit" variant={status.color}>
        {status.label}
      </Badge>

      {status.hasOrders && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="text-[12px] text-gray-500 font-medium ml-1 cursor-pointer h-fit py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {status.info || "Ver agenda"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg font-geist">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-50">
                Agenda de {driver.full_name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Listado de pedidos activos (Pendientes o En tránsito).
              </p>

              <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-3">
                {driver.raw_orders.map((order: any) => {
                  const dateObj = new Date(order.scheduled_at);

                  return (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            Pedido #{order.order_number}
                          </span>
                        </div>
                        <Badge
                          variant={
                            order.status === "in_transit"
                              ? "warning"
                              : "neutral"
                          }
                        >
                          {order.status === "in_transit"
                            ? "En ruta"
                            : "Pendiente"}
                        </Badge>
                      </div>

                      {/* DETALLES DE TIEMPO Y RUTA */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <RiCalendarLine className="size-4 text-gray-400" />
                          <span>
                            {dateObj.toLocaleDateString("es-MX", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <RiTimeLine className="size-4 text-gray-400" />
                          <span>
                            {dateObj.toLocaleTimeString("es-MX", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <RiMapPinRangeLine className="size-4 text-gray-400" />
                          <span className="font-medium">
                            {order.duration_min} min. aprox.
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export const driverColumns = [
  columnHelper.accessor("full_name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Conductor" />
    ),
    meta: {
      displayName: "Conductor",
    },
    cell: ({ row }) => (
      <span className="font-semibold text-gray-900 dark:text-gray-50">
        {row.getValue("full_name")}
      </span>
    ),
  }),
  columnHelper.accessor("status", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    meta: {
      displayName: "Estado",
    },
    cell: DriverStatusCell,
  }),
  columnHelper.accessor("vehicle_plate", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vehículo" />
    ),
    meta: {
      displayName: "Vehículo",
    },
    cell: ({ getValue }) => (
      <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
        <RiCarLine className="size-3.5" />
        <span className="font-mono">{getValue() || "N/A"}</span>
      </div>
    ),
  }),
  columnHelper.accessor("phone", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teléfono" />
    ),
    meta: {
      displayName: "Teléfono",
    },
    cell: ({ getValue }) => (
      <div className="flex items-center gap-1.5 text-sm">
        <RiPhoneLine className="size-3.5 text-gray-400" />
        {getValue() || "N/A"}
      </div>
    ),
  }),
  columnHelper.display({
    id: "edit",
    header: "Acciones",
    meta: { className: "text-right", displayName: "Acciones" },
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  }),
] as ColumnDef<DriverStub>[];
