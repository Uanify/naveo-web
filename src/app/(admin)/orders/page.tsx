import { DataTable } from "@/components/data-table/DataTable";
import { orderColumns } from "@/components/data-table/columns/columns-orders";
import { deleteOrder } from "@/lib/actions/orders";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    page?: string;
    q?: string;
    client?: string;
    status?: string;
    driver?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: Props) {
  const params = await searchParams;

  const pageSize = 20;
  const currentPage = Number(params.page) || 1;

  const queryTerm = (params.q ?? "").trim();
  const isNumericQuery = queryTerm !== "" && /^\d+$/.test(queryTerm);

  const clientId = (params.client ?? "").trim();
  const status = (params.status ?? "").trim();
  const driverId = (params.driver ?? "").trim();

  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", user?.id)
    .single();

  // ✅ options for server-side selects
  const [{ data: clients }, { data: drivers }] = await Promise.all([
    supabase
      .from("clients")
      .select("id, full_name")
      .eq("company_id", profile?.company_id)
      .order("full_name", { ascending: true }),

    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("company_id", profile?.company_id)
      .eq("role", "driver")
      .order("full_name", { ascending: true }),
  ]);

  const statusOptions = [
    { label: "Pendiente", value: "pending" },
    { label: "En recolección", value: "collecting" },
    { label: "En tránsito", value: "in_transit" },
    { label: "Completado", value: "completed" },
    { label: "Cancelado", value: "cancelled" },
  ];

  const clientOptions = (clients ?? []).map((c) => ({
    label: c.full_name,
    value: c.id,
  }));

  const driverOptions = (drivers ?? []).map((d) => ({
    label: d.full_name,
    value: d.id,
  }));

  let query = supabase
    .from("orders")
    .select(
      `
      *,
      clients (id, full_name),
      profiles!orders_driver_id_fkey (id, full_name),
      branches (name)
      `,
      { count: "exact" },
    )
    .eq("company_id", profile?.company_id);

  // ✅ Search only by order_number
  if (queryTerm) {
    if (isNumericQuery) query = query.eq("order_number", Number(queryTerm));
    else query = query.eq("order_number", -1);
  }

  // ✅ Server-side filters
  // Assumes orders has client_id + driver_id
  if (clientId) query = query.eq("client_id", clientId);
  if (status) query = query.eq("status", status);
  if (driverId) query = query.eq("driver_id", driverId);

  const {
    data: orders,
    count,
    error,
  } = await query.order("created_at", { ascending: false }).range(from, to);

  if (error) {
    console.error("Error cargando pedidos:", error);
    return <div>Error al cargar pedidos</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
          Pedidos
        </h1>
      </div>

      <div className="mt-4 sm:mt-6 lg:mt-10">
        <DataTable
          data={orders || []}
          columns={orderColumns}
          rowCount={count || 0}
          searchColumn="order_number"
          searchPlaceholder="Buscar por no. de pedido..."
          addLink="/orders/new"
          editPath="/orders"
          onDelete={deleteOrder}
          onRowClick="/orders"
          serverFilters={[
            { param: "client", placeholder: "Cliente", options: clientOptions },
            { param: "status", placeholder: "Estatus", options: statusOptions },
            { param: "driver", placeholder: "Chofer", options: driverOptions },
          ]}
        />
      </div>
    </div>
  );
}
