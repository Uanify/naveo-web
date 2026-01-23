"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Badge } from "../ui/Badge";

const chartConfig = {
  value: { label: "Actual", color: "#2563eb" },
  previousValue: { label: "Anterior", color: "#94a3b8" },
} satisfies ChartConfig;

interface OverviewChartCardProps {
  title: string;
  value: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  unitType: "currency" | "distance" | "number";
  showComparison: boolean;
  evolution: number;
  isEmpty: boolean;
}

export function OverviewChartCard({
  title,
  value,
  data,
  unitType,
  showComparison,
  evolution,
  isEmpty,
}: OverviewChartCardProps) {
  const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

  const formatPercent = (val: number) => {
    const formatted = (val * 100).toFixed(1);
    return `${val >= 0 ? "+" : ""}${formatted}%`;
  };

  const formatValue = (val: number) => {
    if (unitType === "currency") {
      return new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        ...options,
      }).format(val);
    }

    const formatted = val.toLocaleString("es-MX", options);

    return unitType === "distance" ? `${formatted} km` : formatted;
  };

  return (
    <div className="flex flex-col gap-2 bg-white p-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </span>
        {showComparison && (
          <Badge variant={evolution >= 0 ? "success" : "error"}>
            {formatPercent(evolution)}
          </Badge>
        )}
      </div>
      <span className="text-2xl text-gray-900 dark:text-gray-50">{value}</span>

      <div className="mt-4 h-[120px] w-full flex items-center justify-center">
        {isEmpty ? (
          // Mensaje de estado vacío (centrado en el espacio de la gráfica)
          <div className="flex flex-col items-center gap-1">
            <span className="text-[11px] font-medium text-gray-400 italic">
              No hay registros para este periodo
            </span>
            <div className="w-12 bg-gray-100" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-full w-full aspect-auto"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
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
                  tickMargin={8}
                  minTickGap={10}
                />
                <YAxis
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={3}
                  tickFormatter={(val) =>
                    unitType === "currency" ? `$${val}` : val
                  }
                />
                <ChartTooltip
                  cursor
                  content={
                    <ChartTooltipContent
                      formatter={(val, name) => (
                        <div className="flex justify-between gap-4 w-full min-w-[120px]">
                          <span className="text-gray-500">
                            {name === "value" ? "Actual:" : "Previo:"}
                          </span>
                          <span className="font-medium italic">
                            {formatValue(Number(val))}
                          </span>
                        </div>
                      )}
                    />
                  }
                />
                {showComparison && (
                  <Line
                    dataKey="previousValue"
                    type="monotone"
                    stroke="var(--color-previousValue)"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                  />
                )}
                <Line
                  dataKey="value"
                  type="monotone"
                  stroke="var(--color-value)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </div>
    </div>
  );
}
