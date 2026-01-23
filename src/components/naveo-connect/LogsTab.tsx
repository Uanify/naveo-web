import { DataTable } from "@/components/data-table/DataTable";
import {
  logsColumns,
  ApiLogRow,
} from "@/components/data-table/columns/columns-logs";
import { createClient } from "@/lib/supabase/server";
import { getPagination, isNonEmptyString } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export async function LogsTab({ searchParams }: Props) {
  const params = await searchParams;

  const { from, to } = getPagination(params.page, 20);
  const term = (params.q ?? "").trim();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user?.id)
    .single();

  if (profileError) {
    console.error("Error cargando perfil:", profileError);
    return <div>Error al cargar la empresa del usuario</div>;
  }

  let query = supabase
    .from("api_logs")
    // ⚠️ No traemos request_body/response_body aquí (se cargan on-demand en el modal)
    .select("id, created_at, endpoint, status_code, source_system", {
      count: "exact",
    })
    .eq("company_id", profile?.company_id);

  // ✅ Server-side search (endpoint / source_system / status_code)
  if (isNonEmptyString(term)) {
    const safe = term.replace(/[(),]/g, "");
    const maybeNumber = Number(safe);

    const filters = [
      `endpoint.ilike.%${safe}%`,
      `source_system.ilike.%${safe}%`,
    ];

    if (!Number.isNaN(maybeNumber) && Number.isFinite(maybeNumber)) {
      filters.push(`status_code.eq.${maybeNumber}`);
    }

    query = query.or(filters.join(","));
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error cargando logs:", error);
    return <div>Error al cargar logs</div>;
  }

  const logs = (data ?? []) as ApiLogRow[];

  return (
    <div className="space-y-6">
      <DataTable
        data={logs}
        columns={logsColumns}
        rowCount={count || 0}
        searchColumn="endpoint"
        searchPlaceholder="Buscar por endpoint, origen o status code..."
      />
    </div>
  );
}
