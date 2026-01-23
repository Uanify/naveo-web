"use client";

import {
  RiLoader4Line,
  RiMoneyDollarCircleLine,
  RiCalendarLine,
  RiFlashlightLine,
  RiMapPinRangeLine,
  RiTimeLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Divider } from "@/components/ui/Divider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  RadioCardGroup,
  RadioCardGroupIndicator,
  RadioCardItem,
} from "@/components/ui/RadioCard";
import { DatePicker } from "@/components/ui/DatePicker";
import { RouteMap } from "../common/RouteMap";
import { Textarea } from "../ui/Textarea";
import { useOrderForm } from "@/hooks/useOrderForm";

export function OrderForm() {
  const {
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
  } = useOrderForm();

  if (fetchingData)
    return (
      <div className="p-20 text-center animate-pulse text-gray-400">
        Cargando Naveo...
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="font-geist">
      {/* SECCIÓN 1: RUTA Y MAPA */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-50 text-base">
            Ruta y Logística
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Selecciona el origen y destino.
          </p>
        </div>
        <div className="sm:max-w-3xl md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label>Sucursal de origen</Label>
              <Select
                value={formData.branch_id}
                onValueChange={(val) => handleValueChange("branch_id", val)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Origen..." />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Cliente de destino</Label>
              <Select
                value={formData.client_id}
                onValueChange={(val) => handleValueChange("client_id", val)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Destino..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="h-80 w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 relative bg-gray-50">
            {activeRoute ? (
              <RouteMap
                origin={activeRoute.origin}
                destination={activeRoute.destination}
                onRouteInfo={handleRouteUpdate}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                <RiMapPinRangeLine className="size-10 opacity-20" />
                <p className="text-xs">Selecciona puntos de entrega</p>
              </div>
            )}
          </div>
          {formData.distance_km > 0 && (
            <div className="flex items-start gap-14">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-500 font-medium">Distancia</p>
                <p className="text-2xl font-medium tracking-tight">
                  {formData.distance_km} km
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-500 font-medium">Tiempo</p>
                <p className="text-2xl font-medium tracking-tight">
                  {formData.duration_min} min
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <Divider className="my-14" />

      {/* SECCIÓN 2: PAGO */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-50 text-base">
            Pago
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Valor de la mercancía y método.
          </p>
        </div>
        <div className="sm:max-w-3xl md:col-span-2 space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-3">
              <Label>Valor mercancía</Label>
              <div className="relative mt-2">
                <Input
                  type="number"
                  value={formData.merchandise_value}
                  onChange={(e) =>
                    handleValueChange("merchandise_value", e.target.value)
                  }
                  placeholder="0.00"
                  className="pl-9"
                  required
                />
                <RiMoneyDollarCircleLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              </div>
            </div>
            <div className="col-span-full sm:col-span-3">
              <Label>Método cobro</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(val) =>
                  handleValueChange("payment_method", val)
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Efectivo</SelectItem>
                  <SelectItem value="terminal">Terminal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <RadioCardGroup
            value={formData.is_prepaid}
            onValueChange={(val) => handleValueChange("is_prepaid", val)}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <RadioCardItem value="false" className="flex items-start gap-3">
              <RadioCardGroupIndicator className="mt-1" />
              <div>
                <p className="text-sm font-medium">Cobrar al entregar</p>
              </div>
            </RadioCardItem>
            <RadioCardItem value="true" className="flex items-start gap-3">
              <RadioCardGroupIndicator className="mt-1" />
              <div>
                <p className="text-sm font-medium">Ya pagado</p>
              </div>
            </RadioCardItem>
          </RadioCardGroup>
        </div>
      </div>

      <Divider className="my-14" />

      {/* SECCIÓN 3: PLANIFICACIÓN */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-50 text-base">
            Planificación
          </h2>
          <p className="mt-1 text-sm text-gray-500">¿Inmediato o programado?</p>
        </div>
        <div className="sm:max-w-3xl md:col-span-2 space-y-6">
          <RadioCardGroup
            value={formData.delivery_type}
            onValueChange={(val) => handleValueChange("delivery_type", val)}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <RadioCardItem value="immediate" className="flex items-start gap-3">
              <RadioCardGroupIndicator className="mt-1" />
              <div className="flex items-center gap-2">
                <RiFlashlightLine className="size-4 text-blue-600" />
                <p className="text-sm font-medium">Inmediata</p>
              </div>
            </RadioCardItem>
            <RadioCardItem value="scheduled" className="flex items-start gap-3">
              <RadioCardGroupIndicator className="mt-1" />
              <div className="flex items-center gap-2">
                <RiCalendarLine className="size-4 text-blue-600" />
                <p className="text-sm font-medium">Programar</p>
              </div>
            </RadioCardItem>
          </RadioCardGroup>

          {formData.delivery_type === "scheduled" && (
            <div className="relative">
              <DatePicker
                showTimePicker
                value={formData.scheduled_at}
                onChange={(date) => handleValueChange("scheduled_at", date)}
              />
            </div>
          )}
        </div>
      </div>

      <Divider className="my-14" />

      {/* SECCIÓN 4: ASIGNACIÓN CONDUCTOR */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-50 text-base">
            Asignación
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Validación de disponibilidad.
          </p>
        </div>
        <div className="sm:max-w-3xl md:col-span-2 space-y-4">
          {!canShowDriverSelect ? (
            <div className="rounded-lg border border-gray-200 p-4 text-sm text-gray-600 bg-gray-50">
              Selecciona <b>fecha y hora</b> para validar.
            </div>
          ) : (
            <Select
              value={formData.driver_id}
              onValueChange={(val) => handleValueChange("driver_id", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccionar conductor..." />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((d) => {
                  const hasConflict = checkScheduleConflict(d);
                  const isBusyNow = d.busy_now;
                  const disabled =
                    formData.delivery_type === "immediate"
                      ? isBusyNow || hasConflict
                      : hasConflict;
                  return (
                    <SelectItem key={d.id} value={d.id} disabled={disabled}>
                      <div className="flex flex-col text-left">
                        <span className="font-medium">{d.full_name}</span>
                        {hasConflict ? (
                          <span className="text-[10px] text-red-500 font-bold flex items-center gap-1">
                            <RiTimeLine className="size-3" /> EMPALME DETECTADO
                          </span>
                        ) : formData.delivery_type === "immediate" &&
                          isBusyNow ? (
                          <span className="text-[10px] text-amber-600 font-medium">
                            En servicio ahora
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-medium">
                            Disponible
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          )}

          {formData.driver_id && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
                <RiTimeLine className="size-3" /> Agenda actual
              </h4>
              <div className="mt-3 space-y-2">
                {drivers.find((d) => d.id === formData.driver_id)?.active_orders
                  ?.length > 0 ? (
                  drivers
                    .find((d) => d.id === formData.driver_id)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    ?.active_orders.map((order: any) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center text-sm border-b border-blue-100 pb-2 last:border-0 last:pb-0"
                      >
                        <span className="text-gray-600">
                          {new Date(order.scheduled_at).toLocaleString([], {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="font-medium text-blue-900">
                          ~{order.duration_min} min
                        </span>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-blue-600 italic font-medium">
                    Sin viajes asignados.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Divider className="my-14" />
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-gray-900">Notas</h2>
          <p className="mt-1 text-sm text-gray-500">Notas adicionales.</p>
        </div>
        <div className="sm:max-w-3xl md:col-span-2">
          <Textarea
            value={formData.notes}
            onChange={(e) => handleValueChange("notes", e.target.value)}
            placeholder="Instrucciones especiales..."
          />
        </div>
      </div>

      <Divider className="my-14" />
      <div className="flex items-center justify-end space-x-4">
        <Button variant="secondary" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <RiLoader4Line className="size-4 animate-spin mr-2" />}
          Crear Pedido
        </Button>
      </div>
    </form>
  );
}
