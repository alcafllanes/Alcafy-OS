import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import FinanceBoard from "@/components/FinanceBoard";

export default async function FinancePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: entries } = await supabase.from("finance_entries").select("*").eq("user_id", user?.id);

  return (
    <div>
      <PageHeader title="Finance" subtitle="Income, expenses, and where your money's going." />
      <FinanceBoard initialEntries={(entries ?? []) as any} userId={user?.id ?? ""} />
    </div>
  );
}
