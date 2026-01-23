/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/ui/Table";
import { cx } from "@/lib/utils";
import * as React from "react";

import { DataTableBulkEditor } from "./DataTableBulkEditor";
import { Filterbar } from "./DataTableFilterbar";
import { DataTablePagination } from "./DataTablePagination";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  HeaderGroup,
  Header,
  Row,
  Cell,
} from "@tanstack/react-table";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export type FilterConfig = {
  columnId: string;
  title: string;
  type: "select" | "checkbox" | "number";
  options?: { label: string; value: string }[];
  formatter?: (value: any) => string;
};

// ✅ Server-side select filters (URL params)
export type ServerFilterOption = { label: string; value: string };

export type ServerFilterConfig = {
  // URL param name, e.g. "client", "status", "driver"
  param: string;
  placeholder: string; // UI placeholder (Spanish)
  options: ServerFilterOption[];
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowCount: number;

  searchColumn?: string;
  searchPlaceholder?: string;

  filters?: FilterConfig[];
  serverFilters?: ServerFilterConfig[];

  addLink?: string;
  onDelete?: (id: string | number) => void | Promise<void>;
  editPath?: string;
  enableSelection?: boolean;
  onRowClick?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowCount,
  searchColumn,
  searchPlaceholder,
  filters,
  serverFilters, // ✅ NEW
  addLink,
  onDelete,
  editPath,
  enableSelection = false,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const pageSize = 20;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [rowSelection, setRowSelection] = React.useState({});

  const pageIndex = Number(searchParams.get("page") || 1) - 1;

  function shouldIgnoreRowClick(target: EventTarget | null) {
    const el = target as HTMLElement | null;
    if (!el) return false;

    return Boolean(
      el.closest(
        [
          "button",
          "a",
          "input",
          "textarea",
          "select",
          "[role='button']",
          "[role='menuitem']",
          "[role='checkbox']",
          "[data-row-click='ignore']",
        ].join(","),
      ),
    );
  }

  const table = useReactTable({
    data,
    columns,
    rowCount,
    pageCount: Math.ceil(rowCount / pageSize),
    manualPagination: true,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      rowSelection: enableSelection ? rowSelection : {},
    },
    onPaginationChange: (updater: any) => {
      const nextState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;

      const params = new URLSearchParams(searchParams.toString());
      params.set("page", (nextState.pageIndex + 1).toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    enableRowSelection: enableSelection,
    meta: {
      onDelete,
      editPath,
    },
    onRowSelectionChange: enableSelection ? setRowSelection : undefined,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="space-y-3">
        <Filterbar
          table={table}
          searchColumn={searchColumn}
          searchPlaceholder={searchPlaceholder}
          filters={filters}
          serverFilters={serverFilters}
          addLink={addLink}
        />

        <div className="relative overflow-hidden overflow-x-auto">
          <Table>
            <TableHead>
              {table
                .getHeaderGroups()
                .map((headerGroup: HeaderGroup<TData>) => (
                  <TableRow
                    key={headerGroup.id}
                    className="border-y border-gray-200 dark:border-gray-800"
                  >
                    {headerGroup.headers.map(
                      (header: Header<TData, unknown>) => (
                        <TableHeaderCell
                          key={header.id}
                          className={cx(
                            "whitespace-nowrap py-1 text-sm sm:text-xs",
                            header.column.columnDef.meta?.className,
                          )}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </TableHeaderCell>
                      ),
                    )}
                  </TableRow>
                ))}
            </TableHead>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row: Row<TData>) => (
                  <TableRow
                    key={row.id}
                    onClick={(e: React.MouseEvent<HTMLTableRowElement>) => {
                      if (shouldIgnoreRowClick(e.target)) return;

                      if (onRowClick) {
                        const rowId = (row.original as { id: string }).id;
                        router.push(`${onRowClick}/${rowId}`);
                        return;
                      }

                      if (enableSelection) {
                        row.toggleSelected(!row.getIsSelected());
                      }
                    }}
                    className={cx(
                      "group select-none transition-colors",
                      onRowClick || enableSelection
                        ? "cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-900/80"
                        : "",
                    )}
                  >
                    {row
                      .getVisibleCells()
                      .map((cell: Cell<TData, unknown>, index: number) => (
                        <TableCell
                          key={cell.id}
                          className={cx(
                            enableSelection && row.getIsSelected()
                              ? "bg-gray-50 dark:bg-gray-900"
                              : "",
                            "relative whitespace-nowrap py-1 text-gray-600 first:w-10 dark:text-gray-400",
                            cell.column.columnDef.meta?.className,
                          )}
                        >
                          {index === 0 &&
                            enableSelection &&
                            row.getIsSelected() && (
                              <div className="absolute inset-y-0 left-0 w-0.5 bg-blue-600 dark:bg-blue-500" />
                            )}

                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Sin resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {enableSelection && (
            <DataTableBulkEditor table={table} rowSelection={rowSelection} />
          )}
        </div>

        <DataTablePagination table={table} pageSize={pageSize} />
      </div>
    </>
  );
}
