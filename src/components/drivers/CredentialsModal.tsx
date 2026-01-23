"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { RiFileCopyLine, RiCheckLine } from "@remixicon/react";
import { toast } from "sonner";

interface CredentialsModalProps {
  fleetCode: string;
  pin: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CredentialsModal({
  fleetCode,
  pin,
  isOpen,
  onClose,
}: CredentialsModalProps) {
  const [copiedEmail, setCopiedEmail] = React.useState(false);
  const [copiedPassword, setCopiedPassword] = React.useState(false);

  const copyToClipboard = async (text: string, type: "fleetCode" | "pin") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "fleetCode") {
        setCopiedEmail(true);
        toast.success("Código de flotilla copiado al portapapeles");
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedPassword(true);
        toast.success("PIN copiado al portapapeles");
        setTimeout(() => setCopiedPassword(false), 2000);
      }
    } catch (err) {
      toast.error("Error al copiar al portapapeles");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Conductor creado exitosamente</DialogTitle>
          <DialogDescription>
            Guarda estas credenciales y compártelas con el conductor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fleet-code">Código de flotilla</Label>
            <div className="flex gap-2">
              <Input
                id="fleet-code"
                value={fleetCode}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => copyToClipboard(fleetCode, "fleetCode")}
                className="shrink-0 cursor-pointer"
              >
                {copiedEmail ? (
                  <RiCheckLine className="size-4" />
                ) : (
                  <RiFileCopyLine className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pin">PIN</Label>
            <div className="flex gap-2">
              <Input
                id="pin"
                value={pin}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => copyToClipboard(pin, "pin")}
                className="shrink-0 cursor-pointer"
              >
                {copiedPassword ? (
                  <RiCheckLine className="size-4" />
                ) : (
                  <RiFileCopyLine className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={onClose} className="cursor-pointer">
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
