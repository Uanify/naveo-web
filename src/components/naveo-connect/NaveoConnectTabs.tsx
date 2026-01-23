"use client";

import React from "react";
import { ApiSetupTab } from "@/components/naveo-connect/ApiSetupTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { RiWebhookLine, RiSettings4Line, RiListCheck3 } from "@remixicon/react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  defaultTab: "setup" | "logs";
  logsContent: React.ReactNode;
}

export default function NaveoConnectTabs({ defaultTab, logsContent }: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  const handleTabChange = (value: string) => {
    const next = new URLSearchParams(sp.toString());
    next.set("tab", value);

    // opcional: limpiar q/page si sales de logs
    if (value === "setup") {
      next.delete("page");
      next.delete("q");
    }

    router.replace(`?${next.toString()}`);
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center gap-2">
          <RiWebhookLine className="size-6 text-gray-700" />
          <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
            Naveo Connect
          </h1>
        </div>
      </div>

      <Tabs
        defaultValue={defaultTab}
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="mb-6">
          <TabsTrigger
            value="setup"
            className="flex items-center gap-2 cursor-pointer"
          >
            <RiSettings4Line className="size-4" />
            Configuración y API
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className="flex items-center gap-2 cursor-pointer"
          >
            <RiListCheck3 className="size-4" />
            Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <div className="w-full max-w-3xl mx-auto mt-12">
            <ApiSetupTab />
          </div>
        </TabsContent>

        <TabsContent value="logs">{logsContent}</TabsContent>
      </Tabs>
    </>
  );
}
