"use client";

import { useState, useMemo } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface TopData {
  name: string;
  amount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface TopFiveChartProps {
  title: string;
  totalLabel: string;
  totalValue: string;
  data: TopData[];
  color: string;
  freqKey: string; // 'shipments' o 'purchases'
  freqLabel: string; // 'envíos' o 'compras'
}

export function TopFiveChart({
  title,
  totalLabel,
  totalValue,
  data,
  color,
  freqKey,
  freqLabel,
}: TopFiveChartProps) {
  const [sortBy, setSortBy] = useState<"amount" | "freq">("amount");

  // Ordenamos los datos dinámicamente según la métrica seleccionada
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const valA = sortBy === "amount" ? a.amount : a[freqKey];
      const valB = sortBy === "amount" ? b.amount : b[freqKey];
      return valB - valA;
    });
  }, [data, sortBy, freqKey]);

  const chartConfig = {
    metric: {
      label:
        sortBy === "amount"
          ? "Monto"
          : freqLabel.charAt(0).toUpperCase() + freqLabel.slice(1),
      color: color,
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col gap-6 bg-white w-full">
      {/* Header con Toggle de Filtro */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-500">
            {totalLabel}
          </span>
          <span className="text-3xl font-medium tracking-tight text-gray-900">
            {totalValue}
          </span>
        </div>

        {/* Mini Selector de Métrica */}
        <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-100">
          <button
            onClick={() => setSortBy("amount")}
            className={`px-3 py-1 text-[10px] font-bold uppercase transition-all rounded-md ${
              sortBy === "amount"
                ? "bg-white shadow-sm text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            $ Monto
          </button>
          <button
            onClick={() => setSortBy("freq")}
            className={`px-3 py-1 text-[10px] font-bold uppercase transition-all rounded-md ${
              sortBy === "freq"
                ? "bg-white shadow-sm text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            # {freqLabel}
          </button>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ChartContainer
          config={chartConfig}
          className="h-full w-full aspect-auto"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
                opacity={0.3}
              />
              <XAxis type="number" hide />
              <YAxis
                dataKey="name"
                type="category"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={100}
                className="font-medium text-gray-600"
              />
              <ChartTooltip
                cursor={{ fill: "#f8fafc", opacity: 0.4 }}
                content={
                  <ChartTooltipContent
                    formatter={(value, name, item) => (
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">
                          {title}
                        </span>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-600">Monto:</span>
                          <span className="font-bold">
                            {new Intl.NumberFormat("es-MX", {
                              style: "currency",
                              currency: "MXN",
                            }).format(item.payload.amount)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-gray-600">
                            {freqLabel.charAt(0).toUpperCase() +
                              freqLabel.slice(1)}
                            :
                          </span>
                          <span className="font-bold text-blue-600">
                            {item.payload[freqKey]}
                          </span>
                        </div>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey={sortBy === "amount" ? "amount" : freqKey}
                fill={color}
                radius={[0, 4, 4, 0]}
                barSize={28}
                background={{ fill: "#f8fafc", radius: 4 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
