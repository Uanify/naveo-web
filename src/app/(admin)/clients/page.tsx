import { DataTable } from "@/components/data-table/DataTable";
import { clientColumns } from "@/components/data-table/columns/columns-clients";
import { createClient } from "@/lib/supabase/server";
import { deleteClient } from "@/lib/actions/clients";
import { getPagination, isNonEmptyString } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function ClientsPage({ searchParams }: Props) {
  const params = await searchParams;

  const { from, to } = getPagination(params.page, 20);
  const term = (params.q ?? "").trim();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user?.id)
    .single();

  let query = supabase
    .from("clients")
    .select("*", { count: "exact" })
    .eq("company_id", profile?.company_id);

  if (isNonEmptyString(term)) {
    const safe = term.replace(/[(),]/g, "");
    query = query.or(`full_name.ilike.%${safe}%`);
  }

  const {
    data: clients,
    count,
    error,
  } = await query.order("created_at", { ascending: false }).range(from, to);

  if (error) {
    console.error("Error cargando clientes:", error);
    return <div>Error al cargar clientes</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
          Clientes
        </h1>
      </div>

      <div className="mt-4 sm:mt-6 lg:mt-10">
        <DataTable
          data={clients || []}
          columns={clientColumns}
          rowCount={count || 0}
          searchColumn="full_name"
          searchPlaceholder="Buscar por nombre..."
          addLink="/clients/new"
          editPath="/clients"
          onDelete={deleteClient}
          onRowClick="/clients"
        />
      </div>
    </div>
  );
}
