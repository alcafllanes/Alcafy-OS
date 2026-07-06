import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import JournalBoard from "@/components/JournalBoard";

export default async function JournalPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: entries } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user?.id)
    .order("entry_date", { ascending: false });

  return (
    <div>
      <PageHeader title="Journal" subtitle="A daily place to put your thoughts down." />
      <JournalBoard initialEntries={(entries ?? []) as any} userId={user?.id ?? ""} />
    </div>
  );
}
