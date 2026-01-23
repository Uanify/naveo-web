"use client";

import { Button } from "@/components/ui/Button";
import { Searchbar } from "@/components/ui/Searchbar";
import { RiAddLine } from "@remixicon/react";
import { Table } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { DataTableFilter } from "./DataTableFilter";
import { ViewOptions } from "./DataTableViewOptions";
import { FilterConfig, ServerFilterConfig } from "./DataTable";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

import { ServerDataTableFilter } from "./ServerDataTableFilter"; // ✅ NEW

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchColumn?: string;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  serverFilters?: ServerFilterConfig[];
  addLink?: string;
}

export function Filterbar<TData>({
  table,
  searchColumn,
  searchPlaceholder,
  filters,
  serverFilters,
  addLink,
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryParam = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(queryParam);

  useEffect(() => {
    setSearchTerm(queryParam);
  }, [queryParam]);

  const debouncedUpdateUrl = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value);
    else params.delete("q");

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  }, 400);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedUpdateUrl(value);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    router.push(pathname); // limpia q + client/status/driver + page
  };

  const isFiltered =
    queryParam !== "" ||
    (serverFilters ?? []).some(
      (f) => (searchParams.get(f.param) || "") !== "",
    ) ||
    table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-x-6">
      {/* LEFT */}
      <div className="flex w-full flex-col gap-2 sm:w-fit sm:flex-row sm:items-center">
        {/* ✅ server-side filters styled like DataTableFilter */}
        {(serverFilters ?? []).map((f) => (
          <ServerDataTableFilter
            key={f.param}
            param={f.param}
            title={f.placeholder} // ej: "Cliente", "Estatus", "Chofer"
            options={f.options}
            placeholder="Select"
          />
        ))}

        {/* existing client-side filters (if any) */}
        {filters?.map((filter) => {
          const column = table.getColumn(filter.columnId);
          if (!column || !column.getIsVisible()) return null;
          return (
            <DataTableFilter
              key={filter.columnId}
              column={column}
              title={filter.title}
              options={filter.options}
              type={filter.type}
              formatter={filter.formatter}
            />
          );
        })}

        <Searchbar
          type="search"
          placeholder={searchPlaceholder || "Buscar..."}
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full sm:max-w-[250px] sm:[&>input]:h-[30px]"
        />

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="border cursor-pointer border-gray-200 px-2 font-semibold text-blue-600 sm:border-none sm:py-1 dark:border-gray-800 dark:text-blue-500"
          >
            Limpiar filtros
          </Button>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <ViewOptions table={table} />
        {addLink && (
          <Link href={addLink}>
            <Button
              variant="primary"
              className="hidden gap-x-2 px-2 py-1.5 text-sm sm:text-xs lg:flex cursor-pointer"
            >
              <RiAddLine className="size-4 shrink-0" aria-hidden="true" />
              Agregar
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
