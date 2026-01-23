"use client";

import { CategoryBarCard } from "./DashboardCategoryBarCard";
import { ProgressBarCard } from "./DashboardProgressBarCard";
import { OverviewChartCard } from "./OverviewChartCard";

import { KpiEntry, KpiEntryExtended } from "@/types/dashboard";
import { ordersMock, overviews, topClients, topDrivers } from "@/data/overview-data";
import { useState } from "react";
import { Filterbar, PeriodValue } from "./DashboardFilterbar";
import { isWithinInterval, subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { OrdersDistributionChart } from "./OrdersDistributionChart";
import { TopFiveChart } from "./TopFiveChart";

const fleetData: KpiEntry[] = [
  {
    title: "En ruta activa",
    percentage: 40,
    current: 4,
    allowed: 10,
    unit: "",
  },
  { title: "Disponibles", percentage: 60, current: 6, allowed: 10, unit: "" },
];

const ordersData: KpiEntry[] = [
  { title: "Completados", percentage: 60, current: 30, allowed: 50, unit: "" },
  { title: "En tránsito", percentage: 10, current: 5, allowed: 50, unit: "" },
];

const moneyData: KpiEntryExtended[] = [
  {
    title: "Efectivo",
    percentage: 65,
    value: "$13,500",
    color: "bg-emerald-600 dark:bg-emerald-500",
  },
  {
    title: "Terminal",
    percentage: 35,
    value: "$7,235",
    color: "bg-blue-600 dark:bg-blue-500",
  },
];

const categories = [
  { key: "total_orders", label: "Pedidos totales", unit: "number" },
  { key: "merchandise_value", label: "Valor mercancía", unit: "currency" },
  { key: "naveo_commissions", label: "Comisiones Naveo", unit: "currency" },
  { key: "new_customers", label: "Nuevos clientes", unit: "number" },
  { key: "total_distance", label: "Distancia total (km)", unit: "distance" },
  { key: "wallet_reloads", label: "Recargas Saldo", unit: "currency" },
] as const;

export function DashboardView() {
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [selectedPeriod, setSelectedPeriod] =
    useState<PeriodValue>("previous-period");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categories.map((c) => c.key)
  );

  const [ordersDates, setOrdersDates] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [ordersPeriod, setOrdersPeriod] =
    useState<PeriodValue>("no-comparison");

  const formatTotal = (val: number, unit: string) => {
    if (unit === "currency") {
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(val);
    }
    if (unit === "distance") {
      return `${val.toLocaleString("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} km`;
    }

    return val.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const currencyFormatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const filteredOrders = ordersMock.filter((item) => {
    if (!ordersDates?.from || !ordersDates?.to) return true;
    const itemDate = new Date(item.date);
    return isWithinInterval(itemDate, {
      start: ordersDates.from,
      end: ordersDates.to,
    });
  });

  const totalBilling = ordersMock.reduce((acc, curr) => acc + curr.billing, 0);

  const formattedOrdersData = filteredOrders.map((o) => ({
    ...o,
    formattedDate: new Date(o.date).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
    }),
    dailyBilling: o.billing,
  }));

  return (
    <div className="space-y-14 pb-20 font-geist">
      {/* 1. SECCIÓN DE INDICADORES RÁPIDOS (KPIs) */}
      <section aria-labelledby="current-billing-cycle">
        <h2
          id="current-billing-cycle"
          className="text-lg font-semibold text-gray-900 dark:text-gray-50"
        >
          Resumen operativo del día
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2 xl:grid-cols-3">
          <ProgressBarCard
            title="Estatus de Flotilla"
            change="10 activos"
            value="40%"
            valueDescription="ocupación"
            ctaDescription="Gestiona tus"
            ctaText="choferes."
            ctaLink="/drivers"
            data={fleetData}
          />
          <ProgressBarCard
            title="Progreso de Pedidos"
            change="+5 vs ayer"
            value="30/50"
            valueDescription="completados"
            ctaDescription="Revisa los"
            ctaText="pedidos."
            ctaLink="/orders"
            data={ordersData}
          />
          <CategoryBarCard
            title="Flujo de Cobranza"
            change="$20,735.00"
            value="$13.5k"
            valueDescription="en efectivo"
            subtitle="Métodos de pago"
            ctaDescription="Ver"
            ctaText="billetera."
            ctaLink="/wallet"
            data={moneyData}
          />
        </div>
      </section>

      {/* 2. SECCIÓN DE OVERVIEW HISTÓRICO */}
      <section aria-labelledby="usage-overview">
        <div className="space-y-8">
          {/* Header de la sección con Filtros */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-6 dark:border-gray-800">
            <h2
              id="usage-overview"
              className="text-lg font-semibold text-gray-900 dark:text-gray-50"
            >
              Análisis histórico
            </h2>

            <div className="w-full sm:w-auto">
              <Filterbar
                selectedDates={selectedDates}
                onDatesChange={setSelectedDates}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                categories={categories as any}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {categories
              .filter((c) => selectedCategories.includes(c.key))
              .map((category) => {
                const chartData = overviews
                  .filter((item) => {
                    if (!selectedDates?.from || !selectedDates?.to) return true;
                    const itemDate = new Date(item.date);
                    return isWithinInterval(itemDate, {
                      start: selectedDates.from,
                      end: selectedDates.to,
                    });
                  })
                  .map((item) => {
                    const currentValue =
                      Number(item[category.key as keyof typeof item]) || 0;

                    const simulatedPrevious = currentValue * 0.85;

                    return {
                      date: item.date,
                      value: currentValue,
                      previousValue: simulatedPrevious,
                      formattedDate: new Date(item.date).toLocaleDateString(
                        "es-MX",
                        {
                          day: "2-digit",
                          month: "short",
                        }
                      ),
                    };
                  });

                const isEmpty = chartData.length === 0;

                const totalValueRaw = chartData.reduce(
                  (acc, curr) => acc + curr.value,
                  0
                );
                const totalPrevValueRaw = chartData.reduce(
                  (acc, curr) => acc + curr.previousValue,
                  0
                );

                const evolution =
                  totalPrevValueRaw !== 0
                    ? (totalValueRaw - totalPrevValueRaw) / totalPrevValueRaw
                    : 0;

                return (
                  <OverviewChartCard
                    key={category.key}
                    title={category.label}
                    value={formatTotal(totalValueRaw, category.unit)}
                    data={chartData}
                    unitType={category.unit}
                    showComparison={selectedPeriod !== "no-comparison"}
                    evolution={evolution}
                    isEmpty={isEmpty}
                  />
                );
              })}
          </div>
        </div>
      </section>
      <section aria-labelledby="orders-distribution">
        <div className="space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-6 dark:border-gray-800">
            <h2
              id="orders-distribution"
              className="text-lg font-semibold text-gray-900 dark:text-gray-50"
            >
              Distribución de Pedidos
            </h2>
            <div className="w-full sm:w-auto">
              <Filterbar
                selectedDates={ordersDates}
                onDatesChange={setOrdersDates}
                selectedPeriod={ordersPeriod}
                onPeriodChange={setOrdersPeriod}
                // Pasamos categorías vacías ya que la gráfica de barras es de estados fijos
                categories={[]}
                selectedCategories={[]}
                setSelectedCategories={() => {}}
              />
            </div>
          </div>

          <div className="mt-10">
            <OrdersDistributionChart
              data={formattedOrdersData}
              totalRangeBilling={currencyFormatter.format(totalBilling)}
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">
        <TopFiveChart
          title="Choferes con más envíos"
          totalLabel="Top 5 Choferes por Monto"
          totalValue="$323,801.45" // Suma estática para evitar hidratación
          data={topDrivers}
          color="#CFF1E6"
          freqKey="shipments"
          freqLabel="envíos"
        />

        <TopFiveChart
          title="Clientes con más compras"
          totalLabel="Top 5 Clientes por Monto"
          totalValue="$409,401.10"
          data={topClients}
          color="#FEE3D0"
          freqKey="purchases"
          freqLabel="compras"
        />
      </section>
    </div>
  );
}
