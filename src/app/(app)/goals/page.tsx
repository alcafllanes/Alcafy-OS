import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import GoalsBoard from "@/components/GoalsBoard";

export default async function GoalsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: goals } = await supabase.from("goals").select("*").eq("user_id", user?.id).order("created_at");

  return (
    <div>
      <PageHeader title="Goals" subtitle="The things you're working toward." />
      <GoalsBoard initialGoals={(goals ?? []) as any} userId={user?.id ?? ""} />
    </div>
  );
}
