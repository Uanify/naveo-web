"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { Badge } from "@/components/ui/Badge";
import { formatters } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ColumnDef } from "@tanstack/react-table";

export type Order = {
  id: string;
  order_number: number;
  status: "pending" | "in_transit" | "completed" | "cancelled";
  merchandise_value: number;
  created_at: string;
  scheduled_at: string;
  assigned_at?: string;
  in_transit_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  clients?: { full_name: string };
  branches?: { name: string };
  profiles?: { full_name: string };
};

const columnHelper = createColumnHelper<Order>();

const statusConfig = {
  pending: {
    label: "Pendiente",
    variant: "neutral" as const,
  },
  collecting: {
    label: "En recolección",
    variant: "warning" as const,
  },
  in_transit: {
    label: "En tránsito",
    variant: "default" as const,
  },
  completed: {
    label: "Completado",
    variant: "success" as const,
  },
  cancelled: {
    label: "Cancelado",
    variant: "error" as const,
  },
};

export const orderColumns: ColumnDef<Order, any>[] = [
  // Identificador
  columnHelper.accessor("order_number", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pedido" />
    ),
    meta: {
      displayName: "Pedido",
    },
    filterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return String(value).includes(String(filterValue));
    },
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-gray-50">
          #{row.getValue("order_number")}
        </span>
        <span className="text-xs text-gray-600 tracking-wider">
          Registro:{" "}
          {format(new Date(row.original.created_at), "dd/MM/yy", {
            locale: es,
          })}
        </span>
      </div>
    ),
  }),

  columnHelper.accessor("clients.full_name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente / Origen" />
    ),
    meta: {
      displayName: "Cliente / Origen",
    },
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {row.original.clients?.full_name || "Cliente no registrado"}
        </span>
        <span className="text-xs text-gray-500">
          {row.original.branches?.name || "Sucursal central"}
        </span>
      </div>
    ),
  }),

  // 4. ESTADO (Reemplazado: Badge en lugar de Progreso)
  columnHelper.accessor("status", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estado" />
    ),
    meta: {
      displayName: "Estado",
    },
    cell: ({ row }) => {
      const status = row.original.status as keyof typeof statusConfig;
      const config = statusConfig[status];

      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  }),

  // 2. Programación
  columnHelper.accessor("scheduled_at", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Programado" />
    ),
    meta: {
      displayName: "Programado",
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
            {format(new Date(row.original.scheduled_at), "dd MMM", {
              locale: es,
            })}
          </p>
          <p>-</p>
          <span className="text-sm font-medium text-gray-500">
            {format(new Date(row.original.scheduled_at), "HH:mm'h'")}
          </span>
        </div>
      </div>
    ),
  }),

  // 5. Valor
  columnHelper.accessor("merchandise_value", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor" />
    ),
    meta: {
      displayName: "Valor",
    },
    cell: ({ row }) => (
      <span className="text-sm font-medium tabular-nums text-gray-900 dark:text-gray-50">
        {formatters.currency(row.original.merchandise_value)}
      </span>
    ),
  }),

  // 6. Chofer
  columnHelper.accessor("profiles.full_name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Chofer" />
    ),
    meta: {
      displayName: "Chofer",
    },
    cell: ({ row }) => (
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {row.original.profiles?.full_name || "Sin asignar"}
      </p>
    ),
  }),
];
