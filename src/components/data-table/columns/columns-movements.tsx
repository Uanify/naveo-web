"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { Badge } from "@/components/ui/Badge";
import { ArrowDown, ArrowUp } from "lucide-react";
import { RiCloseLine } from "@remixicon/react";

export type Movement = {
  id: string;
  name: string;
  amount: number;
  type: "income" | "expenses" | "canceled";
  date: string;
};

const columnHelper = createColumnHelper<Movement>();

export const movementColumns = [
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nombre" />
    ),
    meta: { className: "text-left", displayName: "Nombre" },
    cell: ({ row }) => (
      <span className="font-semibold text-gray-900 dark:text-gray-50">
        {row.getValue("name")}
      </span>
    ),
  }),

  columnHelper.accessor("amount", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Monto" />
    ),
    meta: { className: "text-left", displayName: "Monto" },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const type = row.original.type;

      const formatted = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
      }).format(amount);

      const config = {
        income: {
          color: "text-emerald-600",
          symbol: "+",
        },
        expenses: {
          color: "text-red-600",
          symbol: "-",
        },
        canceled: {
          color: "text-gray-900",
          symbol: "",
        },
      };

      const { color, symbol } = config[type] || config.canceled;

      return (
        <span className={`font-medium ${color}`}>
          {symbol} {formatted}
        </span>
      );
    },
  }),

  columnHelper.accessor("type", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    meta: { className: "text-left", displayName: "Tipo" },
    cell: ({ getValue }) => {
      const value = getValue();

      switch (value) {
        case "income":
          return (
            <Badge className="flex items-center gap-1 w-fit" variant="success">
              <ArrowUp className="size-4" />
              Ingreso
            </Badge>
          );
        case "expenses":
          return (
            <Badge className="flex items-center gap-1 w-fit" variant="warning">
              <RiCloseLine className="size-4" />
              Egreso
            </Badge>
          );
        case "canceled":
          return (
            <Badge className="flex items-center gap-1 w-fit" variant="error">
              <ArrowDown className="size-4" />
              Cancelado
            </Badge>
          );
      }
    },
  }),

  columnHelper.accessor("date", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    meta: { className: "text-left", displayName: "Fecha" },
    cell: ({ getValue }) => {
      const date = new Date(getValue());
      return (
        <span className="text-xs tabular-nums">
          {date.toLocaleDateString("es-MX")}
        </span>
      );
    },
  }),

] as ColumnDef<Movement>[];
