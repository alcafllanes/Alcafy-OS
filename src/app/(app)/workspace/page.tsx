import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import WorkspaceBoard from "@/components/WorkspaceBoard";

export default async function WorkspacePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: statusRows } = await supabase
    .from("workspace_statuses")
    .select("*")
    .eq("user_id", user?.id)
    .order("position");
  const { data: taskRows } = await supabase
    .from("workspace_tasks")
    .select("*")
    .eq("user_id", user?.id)
    .order("position");

  const statuses = (statusRows ?? []).map((s) => ({ id: s.id, name: s.name }));
  const cards = (taskRows ?? []).map((t) => ({
    id: t.id,
    statusId: t.status_id,
    title: t.title,
    meta: t.client,
    dateLabel: t.due_date ? t.due_date : undefined,
    tag: t.urgency,
    description: t.description,
  }));

  return (
    <div>
      <PageHeader title="Workspace" subtitle="Track every client and project, board-style." />
      <WorkspaceBoard initialStatuses={statuses} initialCards={cards} userId={user?.id ?? ""} />
    </div>
  );
}
