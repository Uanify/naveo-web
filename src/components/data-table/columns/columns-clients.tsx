"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { RiMapPinLine, RiPhoneLine } from "@remixicon/react";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { DataTableRowActions } from "../DataTableRowActions";

export type Client = {
  id: string;
  full_name: string;
  phone: string | null;
  full_address: string | null;
  city: string;
  neighborhood: string;
  created_at: string;
};

const columnHelper = createColumnHelper<Client>();

export const clientColumns = [
  // Nombre
  columnHelper.accessor("full_name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cliente" />
    ),
    meta: { className: "text-left", displayName: "Cliente" },
    cell: ({ row }) => (
      <span className="font-semibold text-gray-900 dark:text-gray-50">
        {row.getValue("full_name")}
      </span>
    ),
  }),

  // Dirección
  columnHelper.accessor("full_address", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dirección" />
    ),
    meta: { className: "text-left", displayName: "Dirección" },
    cell: ({ row }) => (
      <div className="flex flex-col max-w-[250px] truncate">
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
          <RiMapPinLine className="size-3 shrink-0" />
          <span className="truncate text-xs">{row.original.full_address}</span>
        </div>
        <span className="text-[10px] text-gray-400 uppercase">
          {row.original.neighborhood}, {row.original.city}
        </span>
      </div>
    ),
  }),

  // Teléfono
  columnHelper.accessor("phone", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Teléfono" />
    ),
    meta: { className: "text-left", displayName: "Teléfono" },
    cell: ({ getValue }) => (
      <div className="flex items-center gap-1.5 text-sm">
        <RiPhoneLine className="size-3.5 text-gray-400" />
        {getValue() || "N/A"}
      </div>
    ),
  }),

  // Fecha de Registro
  columnHelper.accessor("created_at", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Registro" />
    ),
    meta: { className: "text-left", displayName: "Registro" },
    cell: ({ getValue }) => {
      const date = new Date(getValue());
      return (
        <span className="text-xs tabular-nums">
          {date.toLocaleDateString("es-MX")}
        </span>
      );
    },
  }),

  // Acciones
  columnHelper.display({
    id: "edit",
    header: "Acciones",
    enableSorting: false,
    enableHiding: false,
    meta: { className: "text-right", displayName: "Edit" },
    cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />,
  }),
] as ColumnDef<Client>[];
