"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { RiMapPinLine, RiPhoneLine } from "@remixicon/react";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { DataTableRowActions } from "../DataTableRowActions";

export type Branch = {
  id: string;
  name: string;
  phone: string | null;
  full_address: string | null;
  city: string;
  neighborhood: string;
  created_at: string;
};

const columnHelper = createColumnHelper<Branch>();

export const branchColumns = [
  // Selección
  /* columnHelper.display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomeRowsSelected() && "indeterminate")
        }
        onCheckedChange={() => table.toggleAllPageRowsSelected()}
        className="translate-y-0.5"
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={() => row.toggleSelected()}
        className="translate-y-0.5"
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: { displayName: "Select" },
  }), */

  // Nombre de la Sucursal
  columnHelper.accessor("name", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sucursal" />
    ),
    meta: { className: "text-left", displayName: "Sucursal" },
    cell: ({ row }) => (
      <span className="font-semibold text-gray-900 dark:text-gray-50">
        {row.getValue("name")}
      </span>
    ),
  }),

  // Dirección (Usamos neighborhood y city para un resumen rápido)
  columnHelper.accessor("full_address", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ubicación" />
    ),
    meta: { className: "text-left", displayName: "Ubicación" },
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
] as ColumnDef<Branch>[];
