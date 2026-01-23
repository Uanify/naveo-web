import { DataTable } from "@/components/data-table/DataTable";
import { branchColumns } from "@/components/data-table/columns/columns-branches";
import { createClient } from "@/lib/supabase/server";
import { deleteBranch } from "@/lib/actions/branches";
import { getPagination, isNonEmptyString } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function BranchesPage({ searchParams }: Props) {
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
    .from("branches")
    .select("*", { count: "exact" })
    .eq("company_id", profile?.company_id);

  // ✅ Server-side search
  if (isNonEmptyString(term)) {
    const safe = term.replace(/[(),]/g, "");
    query = query.ilike("name", `%${safe}%`);
  }

  const {
    data: branches,
    count,
    error,
  } = await query.order("created_at", { ascending: false }).range(from, to);

  if (error) {
    console.error("Error cargando sucursales:", error);
    return <div>Error al cargar sucursales</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
          Sucursales
        </h1>
      </div>

      <div className="mt-4 sm:mt-6 lg:mt-10">
        <DataTable
          data={branches || []}
          columns={branchColumns}
          rowCount={count || 0}
          searchColumn="name"
          searchPlaceholder="Buscar por nombre..."
          addLink="/branches/new"
          editPath="/branches"
          onDelete={deleteBranch}
          onRowClick="/branches"
        />
      </div>
    </div>
  );
}
