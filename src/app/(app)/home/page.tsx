import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import HomeWidgetGrid from "@/components/HomeWidgetGrid";

type Activity = { id: string; text: string; at: string };

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Pull a few recent rows from each module to build a live activity feed.
  const [finance, tasks, journal, goals] = await Promise.all([
    supabase.from("finance_entries").select("label, amount, kind, created_at").eq("user_id", user?.id).order("created_at", { ascending: false }).limit(2),
    supabase.from("workspace_tasks").select("title, urgency, created_at").eq("user_id", user?.id).order("created_at", { ascending: false }).limit(2),
    supabase.from("journal_entries").select("mood, created_at").eq("user_id", user?.id).order("created_at", { ascending: false }).limit(1),
    supabase.from("goals").select("title, created_at").eq("user_id", user?.id).order("created_at", { ascending: false }).limit(1),
  ]);

  const activities: Activity[] = [];
  finance.data?.forEach((f) =>
    activities.push({ id: `f-${f.created_at}`, text: `${f.kind === "expense" ? "Spent" : "Added"} ₱${Number(f.amount).toLocaleString()}, ${f.label}`, at: f.created_at })
  );
  tasks.data?.forEach((t) =>
    activities.push({ id: `t-${t.created_at}`, text: `${t.urgency === "urgent" ? "New urgent task" : "New task"} added to Workspace: ${t.title}`, at: t.created_at })
  );
  journal.data?.forEach((j) => activities.push({ id: `j-${j.created_at}`, text: `New journal entry, feeling ${j.mood}`, at: j.created_at }));
  goals.data?.forEach((g) => activities.push({ id: `g-${g.created_at}`, text: `New goal added: ${g.title}`, at: g.created_at }));
  activities.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  const { data: widgets } = await supabase.from("home_widgets").select("*").eq("user_id", user?.id);

  const fallbackFeed: Activity[] = [
    { id: "demo-1", text: "Added ₱2,500 to Finance, Groceries", at: new Date().toISOString() },
    { id: "demo-2", text: "New urgent task added to Workspace, Client deck revisions", at: new Date().toISOString() },
    { id: "demo-3", text: "New journal entry, feeling good", at: new Date().toISOString() },
  ];

  return (
    <div>
      <PageHeader title="Home" subtitle="Here's what's happened across Alcafy lately." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card col-span-1 p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-muted">Activity feed</h2>
          <ul className="flex flex-col gap-3">
            {(activities.length ? activities : fallbackFeed).map((a) => (
              <li key={a.id} className="flex items-start gap-3 rounded-glass-sm bg-white/50 p-3 text-sm text-ink">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-alc-gradient" />
                <span>{a.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass-card p-5">
          <h2 className="mb-4 text-sm font-semibold text-muted">Quick glance</h2>
          <p className="text-sm text-muted">
            Sample data is shown until you start adding your own, finances, tasks, and journal entries will
            populate this feed automatically.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-sm font-semibold text-muted">Your board</h2>
        <HomeWidgetGrid initialWidgets={widgets ?? []} userId={user?.id ?? ""} />
      </div>
    </div>
  );
}
