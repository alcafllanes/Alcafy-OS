import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import ProfileEditor from "@/components/ProfileEditor";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single();

  return (
    <div>
      <PageHeader title="Profile" subtitle="How others see you across Alcafy." />
      <ProfileEditor
        userId={user?.id ?? ""}
        initial={{
          display_name: profile?.display_name ?? "",
          title: profile?.title ?? "",
          location: profile?.location ?? "",
          bio: profile?.bio ?? "",
          avatar_url: profile?.avatar_url ?? null,
          banner_url: profile?.banner_url ?? null,
        }}
      />
    </div>
  );
}
