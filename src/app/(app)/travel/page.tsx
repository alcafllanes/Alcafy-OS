import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import TravelBoard from "@/components/TravelBoard";

export default async function TravelPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: places } = await supabase.from("travel_places").select("*").eq("user_id", user?.id);

  return (
    <div>
      <PageHeader title="Travel" subtitle="Where you're dreaming of, and where you've been." />
      <TravelBoard initialPlaces={(places ?? []) as any} userId={user?.id ?? ""} />
    </div>
  );
}
