"use client";

import CodeEditor from "@/components/naveo-connect/CodeEditor";
import { ApiDirectTab } from "@/components/naveo-connect/api-direct/ApiDirectTab";
import BatchesTab from "@/components/naveo-connect/api-direct/BatchesTab";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { API_ORDER_MOCK } from "@/mocks/api-order";

import {
  Boxes,
  CopyIcon,
  FileBraces,
  InfoIcon,
  SquareCode,
} from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const EMPTY_BODY_PLACEHOLDER = `{
  "hint": "Añade aquí tus pedidos"
}`;

export default function NaveoConnectPage() {
  const [body, setBody] = useState<string>(EMPTY_BODY_PLACEHOLDER);

  const handleInsertMock = () => {
    setBody(JSON.stringify(API_ORDER_MOCK, null, 2));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(body);
      // no alerts (tremor). you can add a subtle UI later if you want.
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  return (
    <div className="w-full overflow-hidden">
      <Tabs defaultValue="api" className="pt-3">
        <TabsList>
          <TabsTrigger
            className="flex items-center gap-2 text-xs cursor-pointer"
            value="api"
          >
            <SquareCode strokeWidth={1.5} size={16} />
            API Direct
          </TabsTrigger>
          <TabsTrigger
            className="flex items-center gap-2 text-xs cursor-pointer"
            value="batch"
          >
            <Boxes strokeWidth={1.3} size={16} />
            Lotes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="api" className="flex flex-1">
          {/*  Code Section */}
          <section className="h-[calc(100vh-36px)] w-[400px] border-r">
            <div className="h-[60%]">
              <div className="flex border-b w-full justify-between items-center py-0.5 px-2 h-[39px]">
                <p className="text-xs text-gray-600 font-medium">Body</p>
                <div className="flex items-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div
                        title="Información"
                        className="cursor-pointer px-1.5 hover:bg-gray-100 rounded-sm py-2"
                      >
                        <InfoIcon strokeWidth={1.3} size={16} />
                      </div>
                    </PopoverTrigger>

                    <PopoverContent align="start" className="w-72 p-3 z-20">
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs font-medium text-foreground">
                            Datos de usuario
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Datos de ayuda para hacer petición
                          </p>
                        </div>

                        <div className="space-y-1 rounded-md border bg-[#F7F7F7] px-2 py-2">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[11px] text-gray-500">
                              company_id
                            </p>
                            <p className="text-[11px] font-mono text-gray-800 truncate max-w-[165px]">
                              3fa85f64-5717-4562-b3fc-2c963f66afa6
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[11px] text-gray-500">
                              branch_id
                            </p>
                            <p className="text-[11px] font-mono text-gray-800 truncate max-w-[165px]">
                              8b6f2f9e-3e2a-4c9f-9c8e-2a4b1d7f3c10
                            </p>
                          </div>

                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[11px] text-gray-500">
                              client_id
                            </p>
                            <p className="text-[11px] font-mono text-gray-800 truncate max-w-[165px]">
                              2c1a0a9a-3c62-4b4e-9a72-7e9a2a2a4f11
                            </p>
                          </div>
                        </div>

                        <p className="text-[11px] text-muted-foreground">
                          * Si un campo no existe, aquí se mostrará como “—”.
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <Button
                    variant="ghost"
                    title="Insertar mock"
                    onClick={handleInsertMock}
                    className="cursor-pointer px-1.5"
                  >
                    <FileBraces strokeWidth={1.3} size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    title="Copiar"
                    onClick={handleCopy}
                    className="cursor-pointer px-1.5"
                  >
                    <CopyIcon strokeWidth={1.3} size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    title="Enviar pedido"
                    className="cursor-pointer text-xs px-1.5 py-1"
                    onClick={() => {
                      // no integrations yet
                      console.log("Send order clicked (no integrations yet)");
                    }}
                  >
                    Enviar pedido
                  </Button>
                </div>
              </div>
              <div className="border-b h-[calc(100%-39px)]">
                <CodeEditor value={body} onChange={setBody} />
              </div>
            </div>

            <div className="h-[40%]">
              <div className="flex border-b w-full justify-between items-center py-2 px-2 bg-[#F7F7F7] ">
                <p className="text-xs text-gray-600 font-medium">Response</p>
                <p className="text-xs text-gray-600 font-medium">
                  Status:{" "}
                  <span className={twMerge("text-green-700 font-semibold")}>
                    200
                  </span>
                </p>
              </div>
              <div className="h-[calc(100%-33px)]">
                <CodeEditor value={""} readOnly />
              </div>
            </div>
          </section>
          {/* Results Section */}
          <ApiDirectTab />
        </TabsContent>
        <TabsContent value="batch" className="flex flex-1 bg-blue-50">
          <BatchesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
