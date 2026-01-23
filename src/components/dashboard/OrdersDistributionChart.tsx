"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  completed: { label: "Completados", color: "#2563eb" },
  inProgress: { label: "En progreso", color: "#60a5fa" },
  cancelled: { label: "Cancelados", color: "#94a3b8" },
} satisfies ChartConfig;

interface OrderData {
  date: string;
  formattedDate: string;
  completed: number;
  inProgress: number;
  cancelled: number;
  dailyBilling: number;
}

interface OrdersDistributionChartProps {
  data: OrderData[];
  totalRangeBilling: string;
}

export function OrdersDistributionChart({
  data,
  totalRangeBilling,
}: OrdersDistributionChartProps) {
  return (
    <div className="flex flex-col gap-6 bg-white ">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">
            Total Facturado en el periodo
          </span>
        </div>
        <span className="text-3xl font-medium tracking-tight text-gray-900">
          {totalRangeBilling}
        </span>
      </div>

      <div className="h-[300px] w-full">
        <ChartContainer
          config={chartConfig}
          className="h-full w-full aspect-auto"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                opacity={0.3}
              />
              <XAxis
                dataKey="formattedDate"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />

              <YAxis
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(val) => val.toLocaleString()}
              />

              <ChartTooltip
                cursor={{ fill: "#f8fafc", opacity: 0.4 }}
                content={
                  <ChartTooltipContent
                    className="w-56"
                    formatter={(value, name, item) => {
                      const config =
                        chartConfig[name as keyof typeof chartConfig];

                      return (
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 shrink-0 rounded-full"
                                style={{ backgroundColor: config?.color }}
                              />
                              <span className="text-gray-500">
                                {config?.label}:
                              </span>
                            </div>
                            <span className="font-medium">{value} pedidos</span>
                          </div>

                          {name === "cancelled" && (
                            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center text-blue-600">
                              <span className="text-[10px] font-bold uppercase">
                                Facturación del día:
                              </span>
                              <span className="font-bold">
                                {new Intl.NumberFormat("es-MX", {
                                  style: "currency",
                                  currency: "MXN",
                                  minimumFractionDigits: 2,
                                }).format(item.payload.dailyBilling)}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                }
              />

              <Bar
                dataKey="completed"
                stackId="a"
                fill="var(--color-completed)"
                barSize={14}
              />
              <Bar
                dataKey="inProgress"
                stackId="a"
                fill="var(--color-inProgress)"
                barSize={14}
              />
              <Bar
                dataKey="cancelled"
                stackId="a"
                fill="var(--color-cancelled)"
                radius={[4, 4, 0, 0]}
                barSize={14}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
