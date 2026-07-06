import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import SettingsPanel from "@/components/SettingsPanel";

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single();

  return (
    <div>
      <PageHeader title="Settings" subtitle="Account, privacy, and app preferences." />
      <SettingsPanel
        userId={user?.id ?? ""}
        email={user?.email ?? ""}
        initial={{
          display_name: profile?.display_name ?? "",
          avatar_url: profile?.avatar_url ?? null,
          notifications_enabled: profile?.notifications_enabled ?? true,
          is_private: profile?.is_private ?? false,
          dark_mode: profile?.dark_mode ?? false,
        }}
      />
    </div>
  );
}
