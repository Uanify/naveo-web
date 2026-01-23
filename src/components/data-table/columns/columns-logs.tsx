"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTableColumnHeader } from "../DataTableColumnHeader";
import { createClient } from "@/lib/supabase/client";
import { RiInformationLine } from "@remixicon/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

export type ApiLogRow = {
  id: string;
  created_at: string;
  endpoint: string;
  status_code: number | null;
  source_system: string | null;
};

type ApiLogDetails = {
  id: string;
  created_at: string;
  endpoint: string;
  status_code: number | null;
  source_system: string | null;
  request_body: any;
  response_body: any;
};

const columnHelper = createColumnHelper<ApiLogRow>();

function getStatusVariant(code: number | null) {
  if (!code) return { variant: "neutral" as const, label: "N/A" };
  if (code >= 200 && code < 300)
    return { variant: "success" as const, label: `Éxito ${code}` };
  if (code >= 300 && code < 400)
    return { variant: "default" as const, label: `Redirección ${code}` };
  if (code >= 400 && code < 500)
    return { variant: "warning" as const, label: `Cliente ${code}` };
  return { variant: "error" as const, label: `Error ${code}` };
}

function getEventLabel(endpoint: string) {
  const normalized = endpoint.replace(/^\/+/, "");
  if (normalized.includes("incoming-order")) return "Nueva Orden";
  if (normalized.includes("sync-branches")) return "Sync Sucursales";
  return normalized || "Evento";
}

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function prettyJson(value: any) {
  try {
    return JSON.stringify(value ?? null, null, 2);
  } catch {
    return String(value);
  }
}

function truncate(text: string, max = 8000) {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n\n... (truncado, ${text.length} chars)`;
}

function LogDetailsDialog({
  logId,
  open,
  onOpenChange,
}: {
  logId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<ApiLogDetails | null>(null);
  const [activeTab, setActiveTab] = useState<"request" | "response">("request");

  useEffect(() => {
    const load = async () => {
      if (!open) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("api_logs")
        .select(
          "id, created_at, endpoint, status_code, source_system, request_body, response_body",
        )
        .eq("id", logId)
        .single();

      if (!error && data) setDetails(data as ApiLogDetails);
      setLoading(false);
    };

    load();
  }, [open, logId, supabase]);

  const header = details
    ? `${getEventLabel(details.endpoint)} · ${details.source_system || "unknown"}`
    : "Detalles del log";

  const status = details ? getStatusVariant(details.status_code) : null;

  const requestText = truncate(prettyJson(details?.request_body));
  const responseText = truncate(prettyJson(details?.response_body));

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // no-op
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl font-geist">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-50">
            {header}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* meta */}
          <div className="flex flex-wrap items-center gap-2">
            {status && (
              <Badge variant={status.variant} className="w-fit">
                {status.label}
              </Badge>
            )}
            {details?.created_at && (
              <span className="text-xs text-gray-500">
                {formatDate(details.created_at)}
              </span>
            )}
            {details?.endpoint && (
              <span className="text-xs text-gray-400 font-mono">
                {details.endpoint}
              </span>
            )}
          </div>

          {/* tabs */}
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === "request" ? "secondary" : "ghost"}
              className="h-fit py-1.5 px-3 cursor-pointer"
              onClick={() => setActiveTab("request")}
            >
              Request
            </Button>
            <Button
              variant={activeTab === "response" ? "secondary" : "ghost"}
              className="h-fit py-1.5 px-3 cursor-pointer"
              onClick={() => setActiveTab("response")}
            >
              Response
            </Button>

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="ghost"
                className="h-fit py-1.5 px-3 cursor-pointer"
                onClick={() =>
                  copyToClipboard(
                    activeTab === "request" ? requestText : responseText,
                  )
                }
              >
                Copiar JSON
              </Button>
            </div>
          </div>

          {/* content */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-3">
            {loading && (
              <div className="text-sm text-gray-500">Cargando detalle...</div>
            )}

            {!loading && !details && (
              <div className="text-sm text-gray-500">
                No se pudo cargar el detalle.
              </div>
            )}

            {!loading && details && (
              <pre className="text-xs text-gray-700 dark:text-gray-200 whitespace-pre-wrap break-words max-h-[60vh] overflow-auto">
                {activeTab === "request" ? requestText : responseText}
              </pre>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const LogDetailsCell = ({ row }: any) => {
  const [open, setOpen] = useState(false);
  const log = row.original as ApiLogRow;

  return (
    <>
      <div className="flex justify-end">
        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <RiInformationLine className="size-4" />
        </Button>
      </div>

      <LogDetailsDialog logId={log.id} open={open} onOpenChange={setOpen} />
    </>
  );
};

export const logsColumns = [
  columnHelper.accessor("created_at", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fecha" />
    ),
    meta: { displayName: "Fecha" },
    cell: ({ getValue }) => (
      <span className="text-xs text-gray-500">{formatDate(getValue())}</span>
    ),
  }),
  columnHelper.accessor("endpoint", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Evento" />
    ),
    meta: { displayName: "Evento" },
    cell: ({ getValue }) => (
      <span className="font-medium text-gray-900 dark:text-gray-50">
        {getEventLabel(getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("source_system", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Origen" />
    ),
    meta: { displayName: "Origen" },
    cell: ({ getValue }) => (
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-blue-600">
          {getValue() || "unknown"}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor("status_code", {
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Estatus" />
    ),
    meta: { displayName: "Estatus" },
    cell: ({ getValue }) => {
      const { variant, label } = getStatusVariant(getValue());
      return (
        <Badge className="w-fit h-fit" variant={variant}>
          {label}
        </Badge>
      );
    },
  }),
  columnHelper.display({
    id: "details",
    header: "Detalles",
    meta: { className: "text-right", displayName: "Detalles" },
    cell: LogDetailsCell,
  }),
] as ColumnDef<ApiLogRow>[];
