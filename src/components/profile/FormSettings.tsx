import { ReactNode } from "react";
import { Button } from "../ui/Button";

interface FormRowProps {
  label: string;
  description: ReactNode;
  children: ReactNode;
}

export function FormRow({ label, description, children }: FormRowProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 p-4 last:border-b-0">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-300">
          {label}
        </p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className="w-full sm:w-1/2">{children}</div>
    </div>
  );
}

interface FormCardProps {
  children: ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
  isPending?: boolean;
  title: string;
  description?: ReactNode;
  showButtons?: boolean;
  variant?: "default" | "danger";
  saveLabel?: string;
}

export function FormCard({
  children,
  onSave,
  onCancel,
  isPending,
  title,
  description,
  showButtons = true,
  variant = "default",
  saveLabel = "Guardar",
}: FormCardProps) {
  const isDanger = variant === "danger";
  const borderColor = isDanger ? "border-red-200" : "border-gray-200";

  const backgroundColor = isDanger ? "bg-red-50/50" : "bg-white";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <div className="text-sm text-gray-600">{description}</div>
        )}
      </div>

      <div
        className={`border ${borderColor} rounded-lg ${backgroundColor} dark:bg-transparent overflow-hidden`}
      >
        <div className="flex flex-col">{children}</div>

        {showButtons && (
          <div
            className={`flex flex-row justify-end gap-2 px-5 py-3 border-t ${borderColor} ${
              isDanger
                ? "bg-red-50/50 dark:bg-red-950/20"
                : "bg-gray-50/50 dark:bg-gray-900/50"
            }`}
          >
            {onCancel && (
              <Button
                variant="ghost"
                onClick={onCancel}
                disabled={isPending}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
            )}
            <Button
              onClick={onSave}
              disabled={isPending}
              variant={isDanger ? "destructive" : "primary"}
              className="cursor-pointer"
            >
              {isPending ? "Procesando..." : saveLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
