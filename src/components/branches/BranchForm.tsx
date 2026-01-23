"use client";

import { RiLoader4Line, RiMapPinLine, RiSearchLine } from "@remixicon/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Divider } from "@/components/ui/Divider";
import { MapPicker } from "@/components/branches/MapPicker";
import { BranchFormProps, useBranchForm } from "@/hooks/useBranchForm";

export function BranchForm({ initialData }: BranchFormProps) {
  const {
    formData,
    handleChange,
    handleSubmit,
    handleSelectResult,
    handleLocationUpdate,
    search,
    setSearch,
    results,
    isSearching,
    showResults,
    setShowResults,
    loading,
    router,
    isEditing,
  } = useBranchForm({
    initialData,
  });

  return (
    <form onSubmit={handleSubmit}>
      {/* Sección 1: Información General */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 font-geist">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-50">
            Información de la sucursal
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Define el nombre y datos de contacto básicos para identificar esta
            sucursal.
          </p>
        </div>
        <div className="sm:max-w-3xl md:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-4">
              <Label
                htmlFor="name"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Nombre de la sucursal
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej. Matriz Centro"
                required
                className="mt-2"
              />
            </div>
            <div className="col-span-full sm:col-span-2">
              <Label
                htmlFor="phone"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Teléfono
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="123 456 7890"
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </div>

      <Divider className="my-14" />

      {/* Sección 2: Ubicación en el Mapa */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-50">
            Ubicación en el mapa
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Busca una dirección o mueve el marcador para obtener las coordenadas
            precisas.
          </p>
        </div>
        <div className="sm:max-w-3xl md:col-span-2 space-y-6">
          <div className="relative">
            <Label
              htmlFor="search"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Buscar dirección
            </Label>
            <div className="relative mt-2">
              <Input
                id="search"
                type="text"
                placeholder="Buscar en dirección..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowResults(results.length > 0)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                className="pl-9"
              />
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              {isSearching && (
                <RiLoader4Line className="absolute right-3 top-1/2 -translate-y-1/2 size-4 animate-spin text-gray-400" />
              )}
            </div>
            {showResults && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white  dark:bg-gray-900 dark:border-gray-800 overflow-hidden divide-y divide-gray-100 dark:divide-gray-800 max-h-32 overflow-y-auto">
                {results.map((feature, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectResult(feature)}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-start gap-3"
                  >
                    <RiMapPinLine className="size-4 mt-0.5 text-gray-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {feature.properties.name || feature.properties.street}{" "}
                        {feature.properties.housenumber}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {[
                          feature.properties.district,
                          feature.properties.city,
                          feature.properties.state,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-92 w-full rounded-lg overflow-hidden relative">
            <MapPicker
              onLocationSelect={handleLocationUpdate}
              initialLocation={
                formData.lat && formData.lng
                  ? { lat: formData.lat, lng: formData.lng }
                  : undefined
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="lat"
                className="text-xs font-medium text-gray-500 uppercase"
              >
                Latitud
              </Label>
              <Input
                id="lat"
                value={formData.lat}
                readOnly
                className="bg-gray-50 dark:bg-gray-900/50 mt-1"
              />
            </div>
            <div>
              <Label
                htmlFor="lng"
                className="text-xs font-medium text-gray-500 uppercase"
              >
                Longitud
              </Label>
              <Input
                id="lng"
                value={formData.lng}
                readOnly
                className="bg-gray-50 dark:bg-gray-900/50 mt-1"
              />
            </div>
          </div>
        </div>
      </div>

      <Divider className="my-14" />

      {/* Sección 3: Dirección Detallada */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-gray-50">
            Dirección detallada
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Estos campos se autocompletarán al usar el buscador, pero puedes
            ajustarlos manualmente.
          </p>
        </div>
        <div className="sm:max-w-3xl md:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
            <div className="col-span-full sm:col-span-4">
              <Label
                htmlFor="street"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Calle
              </Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
            <div className="col-span-full sm:col-span-1">
              <Label
                htmlFor="ext_number"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Ext.
              </Label>
              <Input
                id="ext_number"
                name="ext_number"
                value={formData.ext_number}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
            <div className="col-span-full sm:col-span-1">
              <Label
                htmlFor="int_number"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Int.
              </Label>
              <Input
                id="int_number"
                name="int_number"
                value={formData.int_number}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
            <div className="col-span-full sm:col-span-3">
              <Label
                htmlFor="neighborhood"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Colonia
              </Label>
              <Input
                id="neighborhood"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
            <div className="col-span-full sm:col-span-3">
              <Label
                htmlFor="zip_code"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Código Postal
              </Label>
              <Input
                id="zip_code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
            <div className="col-span-full sm:col-span-2">
              <Label
                htmlFor="city"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Ciudad
              </Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
            <div className="col-span-full sm:col-span-2">
              <Label
                htmlFor="state"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Estado
              </Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
            <div className="col-span-full sm:col-span-2">
              <Label
                htmlFor="country"
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                País
              </Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="mt-2"
              />
            </div>
          </div>
        </div>
      </div>

      <Divider className="my-14" />

      <div className="flex items-center justify-end space-x-4">
        <Button
          variant="secondary"
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="cursor-pointer"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="cursor-pointer">
          {loading && <RiLoader4Line className="size-4 animate-spin mr-2" />}
          {isEditing ? "Actualizar sucursal" : "Guardar sucursal"}
        </Button>
      </div>
    </form>
  );
}
