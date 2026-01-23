import { DashboardView } from "@/components/dashboard/DashboardView";

export default async function DashboardPage() {
/*   const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }
 */

  return <DashboardView />;
}
