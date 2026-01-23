"use client";

import {
  CommandBar,
  CommandBarBar,
  CommandBarCommand,
  CommandBarSeperator,
  CommandBarValue,
} from "@/components/ui/CommandBar";
import { RowSelectionState, Table } from "@tanstack/react-table";
import { toast } from "sonner";

type DataTableBulkEditorProps<TData> = {
  table: Table<TData>;
  rowSelection: RowSelectionState;
};

function DataTableBulkEditor<TData>({
  table,
  rowSelection,
}: DataTableBulkEditorProps<TData>) {
  const hasSelectedRows = Object.keys(rowSelection).length > 0;

  return (
    <CommandBar open={hasSelectedRows}>
      <CommandBarBar>
        <CommandBarValue>
          {Object.keys(rowSelection).length} seleccionados
        </CommandBarValue>
        <CommandBarSeperator />
        <CommandBarCommand
          label="Editar"
          action={() => {
            toast.info("Edición masiva próximamente");
          }}
          shortcut={{ shortcut: "e" }}
        />
        <CommandBarSeperator />
        <CommandBarCommand
          label="Eliminar"
          action={() => {
            toast.error("Eliminación masiva no implementada");
          }}
          shortcut={{ shortcut: "d" }}
        />
        <CommandBarSeperator />
        <CommandBarCommand
          label="Reiniciar"
          action={() => {
            table.resetRowSelection();
          }}
          shortcut={{ shortcut: "Escape", label: "esc" }}
        />
      </CommandBarBar>
    </CommandBar>
  );
}

export { DataTableBulkEditor };
