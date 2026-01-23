import NaveoConnectTabs from "@/components/naveo-connect/NaveoConnectTabs";
import { LogsTab } from "@/components/naveo-connect/LogsTab";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ page?: string; q?: string; tab?: string }>;
}

export default async function NaveoConnectPage({ searchParams }: Props) {
  const params = await searchParams;

  const defaultTab = (params.tab === "logs" ? "logs" : "setup") as
    | "setup"
    | "logs";

  return (
    <div className="p-6">
      <NaveoConnectTabs
        defaultTab={defaultTab}
        logsContent={<LogsTab searchParams={searchParams} />}
      />
    </div>
  );
}
