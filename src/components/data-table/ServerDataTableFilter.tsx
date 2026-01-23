"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { RiAddLine, RiArrowDownSLine } from "@remixicon/react";

import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { cx, focusRing } from "@/lib/utils";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

type Option = { label: string; value: string };

type Props = {
  param: string; // URL param: "client" | "status" | "driver"
  title: string; // UI title: "Cliente" | "Estatus" | "Chofer"
  options: Option[];
  placeholder?: string;
  widthClassName?: string;
};

const ALL_VALUE = "__all__";

export function ServerDataTableFilter({
  param,
  title,
  options,
  placeholder = "Select",
  widthClassName = "sm:min-w-56 sm:max-w-56",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Si no existe el param en URL => ALL_VALUE
  const urlValue = searchParams.get(param);
  const currentValue = urlValue ?? ALL_VALUE;

  // "Aplicado" solo si en URL hay un valor real
  const isApplied = Boolean(urlValue);

  const [selectedValue, setSelectedValue] =
    React.useState<string>(currentValue);

  React.useEffect(() => {
    setSelectedValue(currentValue);
  }, [currentValue]);

  const appliedLabel = React.useMemo(() => {
    if (!isApplied) return undefined;
    return options.find((o) => o.value === urlValue)?.label ?? urlValue ?? "";
  }, [isApplied, options, urlValue]);

  const setParam = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === ALL_VALUE) params.delete(param);
    else params.set(param, value);

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setSelectedValue(ALL_VALUE);
    setParam(ALL_VALUE);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cx(
            "flex w-full items-center gap-x-1.5 cursor-pointer whitespace-nowrap rounded-md border border-gray-300 px-2 py-1.5 font-medium text-gray-600 hover:bg-gray-50 sm:w-fit sm:text-xs dark:border-gray-700 dark:text-gray-400 hover:dark:bg-gray-900",
            isApplied ? "" : "border-dashed",
            focusRing,
          )}
        >
          <span
            aria-hidden="true"
            onClick={(e) => {
              if (isApplied) {
                e.stopPropagation();
                handleReset();
              }
            }}
          >
            <RiAddLine
              className={cx(
                "-ml-px size-5 shrink-0 cursor-pointer transition sm:size-4",
                isApplied && "rotate-45 hover:text-red-500",
              )}
              aria-hidden="true"
            />
          </span>

          <span>{title}</span>

          {appliedLabel && (
            <>
              <span
                className="h-4 w-px bg-gray-300 dark:bg-gray-700"
                aria-hidden="true"
              />
              <span className="truncate font-semibold text-blue-600 dark:text-blue-400">
                {appliedLabel}
              </span>
            </>
          )}

          <RiArrowDownSLine
            className="size-5 shrink-0 text-gray-500 sm:size-4"
            aria-hidden="true"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={7}
        className={cx(
          "min-w-[calc(var(--radix-popover-trigger-width))] max-w-[calc(var(--radix-popover-trigger-width))]",
          widthClassName,
        )}
        onInteractOutside={() => {
          // Si no hay filtro aplicado en URL, resetea state visual
          if (!isApplied) setSelectedValue(ALL_VALUE);
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setParam(selectedValue);
          }}
        >
          <div className="space-y-2">
            <div>
              <Label className="text-base font-medium sm:text-sm">
                Filtrar por {title}
              </Label>

              <Select value={selectedValue} onValueChange={setSelectedValue}>
                <SelectTrigger className="mt-2 sm:py-1">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                  {/* ✅ NO vacío */}
                  <SelectItem value={ALL_VALUE}>Todos</SelectItem>

                  {options.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <PopoverClose className="w-full" asChild>
              <Button type="submit" className="w-full sm:py-1 cursor-pointer">
                Aplicar
              </Button>
            </PopoverClose>

            {isApplied && (
              <Button
                variant="secondary"
                className="w-full sm:py-1"
                type="button"
                onClick={handleReset}
              >
                Limpiar
              </Button>
            )}
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
