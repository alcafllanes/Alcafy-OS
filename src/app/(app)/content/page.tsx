import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import ContentBoard from "@/components/ContentBoard";

export default async function ContentPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: statusRows } = await supabase.from("content_statuses").select("*").eq("user_id", user?.id).order("position");
  const { data: itemRows } = await supabase.from("content_items").select("*").eq("user_id", user?.id).order("position");

  const statuses = (statusRows ?? []).map((s) => ({ id: s.id, name: s.name }));
  const cards = (itemRows ?? []).map((c) => ({
    id: c.id,
    statusId: c.status_id,
    title: c.title,
    meta: c.platform,
    dateLabel: c.post_date ? c.post_date : undefined,
    description: c.notes,
    thumbnailUrl: c.thumbnail_url,
  }));

  return (
    <div>
      <PageHeader title="Content" subtitle="From idea to upload." />
      <ContentBoard initialStatuses={statuses} initialCards={cards} userId={user?.id ?? ""} />
    </div>
  );
}
