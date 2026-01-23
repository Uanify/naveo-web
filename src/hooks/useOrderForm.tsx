"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useOrderForm() {
  const BUFFER_MIN = 10;

  const getOrderWindow = (scheduledAt: string | Date, duration: number) => {
    const startMs = new Date(scheduledAt).getTime();
    if (!Number.isFinite(startMs)) return null;
    const endMs = startMs + (duration * 2 + BUFFER_MIN) * 60_000;
    return { startMs, endMs };
  };

  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  const [branches, setBranches] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    branch_id: "",
    client_id: "",
    driver_id: "",
    merchandise_value: "",
    payment_method: "cash",
    is_prepaid: "false",
    delivery_type: "immediate",
    scheduled_at: undefined as Date | undefined,
    notes: "",
    priority: "1",
    distance_km: 0,
    duration_min: 0,
    software_fee: 0,
  });

  // ============================================================================
  // LÓGICA REACTIVA (MEMOIZADA)
  // ============================================================================

  // Fecha propuesta basada en el modo (Inmediato o Programado)
  const proposedDate = useMemo(() => {
    return formData.delivery_type === "immediate"
      ? new Date()
      : formData.scheduled_at;
  }, [formData.delivery_type, formData.scheduled_at]);

  // Determinar si ya podemos mostrar el select de choferes
  const canShowDriverSelect = useMemo(() => {
    return (
      formData.delivery_type === "immediate" ||
      (formData.delivery_type === "scheduled" && !!formData.scheduled_at)
    );
  }, [formData.delivery_type, formData.scheduled_at]);

  // Validador de colisiones de agenda
  const checkScheduleConflict = useCallback(
    (driver: any) => {
      if (!proposedDate || !driver.active_orders) return false;

      const proposedWindow = getOrderWindow(
        proposedDate,
        formData.duration_min
      );
      if (!proposedWindow) return false;

      return driver.active_orders.some((order: any) => {
        const existingWindow = getOrderWindow(
          order.scheduled_at,
          order.duration_min
        );
        if (!existingWindow) return false;

        // Conflicto si las ventanas se cruzan
        return (
          proposedWindow.startMs < existingWindow.endMs &&
          proposedWindow.endMs > existingWindow.startMs
        );
      });
    },
    [proposedDate, formData.duration_min]
  );

  // Actualizar ruta (Memoizada para que el mapa no bloquee el formulario)
  const handleRouteUpdate = useCallback(
    (info: { distanceKm: number; durationMin: number }) => {
      setFormData((prev) => {
        const nextFee = 5;
        if (
          prev.distance_km === info.distanceKm &&
          prev.duration_min === info.durationMin
        ) {
          return prev;
        }
        return {
          ...prev,
          distance_km: info.distanceKm,
          duration_min: info.durationMin,
          software_fee: nextFee,
        };
      });
    },
    []
  );

  const activeRoute = useMemo(() => {
    const branch = branches.find((b) => b.id === formData.branch_id);
    const client = clients.find((c) => c.id === formData.client_id);
    if (branch && client) {
      return {
        origin: { lat: branch.lat, lng: branch.lng, name: branch.name },
        destination: {
          lat: client.lat,
          lng: client.lng,
          name: client.full_name,
        },
      };
    }
    return null;
  }, [branches, clients, formData.branch_id, formData.client_id]);

  // ============================================================================
  // CARGA DE DATOS
  // ============================================================================

  useEffect(() => {
    async function loadData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { data: profile } = await supabase
          .from("profiles")
          .select("company_id")
          .eq("id", user?.id)
          .single();

        if (profile) {
          const [b, c, d] = await Promise.all([
            supabase
              .from("branches")
              .select("*")
              .eq("company_id", profile.company_id),
            supabase
              .from("clients")
              .select("*")
              .eq("company_id", profile.company_id),
            supabase
              .from("profiles")
              .select(
                `id, full_name, orders!orders_driver_id_fkey(id, status, scheduled_at, duration_min)`
              )
              .eq("company_id", profile.company_id)
              .eq("role", "driver"),
          ]);

          setBranches(b.data || []);
          setClients(c.data || []);

          const nowMs = Date.now();
          setDrivers(
            (d.data || []).map((driver: any) => {
              const activeOrders =
                driver.orders?.filter(
                  (o: any) => !["completed", "cancelled"].includes(o.status)
                ) || [];
              const busyNow = activeOrders.some((o: any) => {
                if (o.status === "in_transit") return true;
                const w = getOrderWindow(o.scheduled_at, o.duration_min);
                return w ? nowMs >= w.startMs && nowMs <= w.endMs : false;
              });
              return {
                id: driver.id,
                full_name: driver.full_name,
                active_orders: activeOrders,
                busy_now: busyNow,
              };
            })
          );
        }
      } catch (error: any) {
        toast.error("Error al cargar datos");
      } finally {
        setFetchingData(false);
      }
    }
    loadData();
  }, [supabase]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleValueChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.driver_id) return toast.error("Selecciona un conductor.");
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user?.id)
        .single();
      const finalDate =
        formData.delivery_type === "immediate"
          ? new Date().toISOString()
          : formData.scheduled_at?.toISOString();
      const { error } = await supabase.from("orders").insert({
        company_id: profile?.company_id,
        branch_id: formData.branch_id,
        client_id: formData.client_id,
        driver_id: formData.driver_id,
        merchandise_value: parseFloat(formData.merchandise_value),
        payment_method: formData.payment_method,
        payment_status: formData.is_prepaid === "true" ? "paid" : "pending",
        is_prepaid: formData.is_prepaid === "true",
        status: "pending",
        scheduled_at: finalDate,
        notes: formData.notes,
        priority: parseInt(formData.priority),
        distance_km: formData.distance_km,
        duration_min: formData.duration_min,
        software_fee: formData.software_fee,
      });
      if (error) throw error;
      toast.success("Pedido generado con éxito");
      router.push("/orders");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchingData,
    branches,
    clients,
    drivers,
    formData,
    canShowDriverSelect,
    checkScheduleConflict,
    handleRouteUpdate,
    activeRoute,
    handleValueChange,
    handleSubmit,
    router,
  };
}
