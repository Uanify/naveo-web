import { DataTable } from "@/components/data-table/DataTable";
import { driverColumns } from "@/components/data-table/columns/columns-drivers";
import { createClient } from "@/lib/supabase/server";
import { deleteDriver } from "@/lib/actions/drivers";
import { getPagination, isNonEmptyString } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string; q?: string }>;
}

export default async function DriversPage({ searchParams }: Props) {
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
    .from("profiles")
    .select(
      `
      id, full_name, phone, role, created_at,
      driver_details ( vehicle_plate ),
      orders!orders_driver_id_fkey (
        id, order_number, status, scheduled_at, duration_min
      )
    `,
      { count: "exact" },
    )
    .eq("company_id", profile?.company_id)
    .eq("role", "driver");

  // ✅ Server-side search
  if (isNonEmptyString(term)) {
    const safe = term.replace(/[(),]/g, ""); // evita romper .or()
    // Si quieres solo nombre, deja solo full_name.ilike...
    query = query.or(`full_name.ilike.%${safe}%,phone.ilike.%${safe}%`);
  }

  const {
    data: drivers,
    count,
    error,
  } = await query.order("created_at", { ascending: false }).range(from, to);

  if (error) {
    console.error("Error cargando conductores:", error);
    return <div>Error al cargar conductores</div>;
  }

  const formattedDrivers = (drivers ?? []).map((driver: any) => {
    const activeOrders =
      driver.orders?.filter(
        (o: any) => !["completed", "cancelled"].includes(o.status),
      ) || [];

    const now = new Date();

    const orderInTransit = activeOrders.find(
      (o: any) => o.status === "in_transit",
    );

    const imminentOrder = activeOrders.find((o: any) => {
      const start = new Date(o.scheduled_at);
      const diff = (start.getTime() - now.getTime()) / 60000;
      return o.status === "pending" && diff <= 15 && diff >= -60;
    });

    const busyInWindow = activeOrders.find((o: any) => {
      const start = new Date(o.scheduled_at);
      const endWindow = new Date(start.getTime() + o.duration_min * 2 * 60000);
      return now >= start && now <= endWindow && o.status === "pending";
    });

    type SmartStatus = {
      label: string;
      color: "success" | "warning" | "default" | "neutral";
      info: string;
      hasOrders: boolean;
    };

    let smartStatus: SmartStatus = {
      label: "Disponible",
      color: "success",
      info:
        activeOrders.length > 0
          ? `${activeOrders.length} pedido(s) agendados`
          : "Sin pedidos",
      hasOrders: activeOrders.length > 0,
    };

    if (orderInTransit) {
      smartStatus = {
        label: "En Tránsito",
        color: "warning",
        info: `Pedido #${orderInTransit.order_number}`,
        hasOrders: true,
      };
    } else if (imminentOrder) {
      smartStatus = {
        label: "Asignado",
        color: "default",
        info: "Salida inminente",
        hasOrders: true,
      };
    } else if (busyInWindow) {
      smartStatus = {
        label: "Ocupado",
        color: "neutral",
        info: "En servicio / Retornando",
        hasOrders: true,
      };
    }

    return {
      ...driver,
      vehicle_plate:
        driver.driver_details?.[0]?.vehicle_plate ||
        driver.driver_details?.vehicle_plate ||
        "N/A",
      status: smartStatus,
      raw_orders: activeOrders,
    };
  });

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
          Conductores
        </h1>
      </div>

      <div className="mt-4 sm:mt-6">
        <DataTable
          data={formattedDrivers}
          columns={driverColumns}
          rowCount={count || 0}
          searchColumn="full_name"
          searchPlaceholder="Buscar por nombre o teléfono..."
          addLink="/drivers/new"
          editPath="/drivers"
          onDelete={deleteDriver}
          onRowClick="/drivers" // si tienes detalle
        />
      </div>
    </div>
  );
}
