import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Runs exactly once per user, the very first time they load any page after
 * signing up. Inserts real, deletable starter rows so the app does not feel
 * empty on day one, then flips profiles.onboarded to true so this never
 * runs again, even after the user deletes everything.
 */
export async function seedDemoContentIfNeeded(supabase: SupabaseClient, userId: string) {
  const { data: profile } = await supabase.from("profiles").select("onboarded").eq("id", userId).single();
  if (profile?.onboarded) return;

  const month = new Date();
  month.setDate(1);
  const monthStr = month.toISOString().slice(0, 10);

  // Goals
  await supabase.from("goals").insert([
    { user_id: userId, title: "Dream house", note: "A quiet place with a garden, by 2029", target_date: "2029-01-01", progress: 35 },
    { user_id: userId, title: "Dream car", note: "Something reliable for long drives", target_date: "2027-06-01", progress: 60 },
    { user_id: userId, title: "Dream phone", note: "Next upgrade, no rush", progress: 10 },
  ]);

  // Workspace
  const { data: wsStatuses } = await supabase
    .from("workspace_statuses")
    .insert([
      { user_id: userId, name: "Processing", position: 0 },
      { user_id: userId, name: "Revision", position: 1 },
      { user_id: userId, name: "Done", position: 2 },
    ])
    .select();
  if (wsStatuses) {
    const [processing, revision, done] = wsStatuses;
    await supabase.from("workspace_tasks").insert([
      { user_id: userId, status_id: processing.id, title: "Landing page redesign", client: "Acme Co.", due_date: "2026-06-30", urgency: "high" },
      { user_id: userId, status_id: revision.id, title: "Logo concepts v2", client: "Bloom Studio", due_date: "2026-07-02", urgency: "urgent" },
      { user_id: userId, status_id: done.id, title: "Social media kit", client: "Nova Brand", due_date: "2026-06-20", urgency: "normal" },
    ]);
  }

  // Finance
  await supabase.from("finance_entries").insert([
    { user_id: userId, kind: "income", label: "Salary", amount: 42000, month: monthStr },
    { user_id: userId, kind: "expense", label: "Living costs", amount: 27500, month: monthStr },
    { user_id: userId, kind: "saving", label: "Emergency fund", amount: 14500, target_amount: 30000, month: monthStr },
    { user_id: userId, kind: "debt", label: "Credit card", amount: 8200, month: monthStr },
    { user_id: userId, kind: "tuition", label: "Tuition, Term 2", amount: 12000, target_amount: 25000, month: monthStr },
    { user_id: userId, kind: "bill", label: "Utilities", amount: 1800, month: monthStr },
  ]);

  // Study Hub
  const { data: subjects } = await supabase
    .from("subjects")
    .insert([
      { user_id: userId, name: "Data Structures" },
      { user_id: userId, name: "Marketing 101" },
    ])
    .select();
  if (subjects) {
    const [ds, mk] = subjects;
    await supabase.from("subject_items").insert([
      { user_id: userId, subject_id: ds.id, kind: "assignment", title: "Linked list lab", due_date: "2026-07-02", done: false },
      { user_id: userId, subject_id: ds.id, kind: "exam", title: "Midterm", due_date: "2026-07-10", done: false },
      { user_id: userId, subject_id: mk.id, kind: "assignment", title: "Brand audit paper", due_date: "2026-06-29", done: true },
    ]);
  }
  await supabase.from("certifications").insert([
    { user_id: userId, title: "Google UX Design", provider: "Coursera", status: "in_progress", progress: 55 },
    { user_id: userId, title: "Meta Front-End", provider: "Coursera", status: "not_started", progress: 0 },
  ]);

  // Journal
  await supabase.from("journal_entries").insert([
    { user_id: userId, mood: "happy", body: "Finished the client deck early, felt productive today.", entry_date: "2026-06-24" },
    { user_id: userId, mood: "sleepy", body: "Slow start but caught up on readings by evening.", entry_date: "2026-06-22" },
  ]);

  // Content
  const { data: contentStatuses } = await supabase
    .from("content_statuses")
    .insert([
      { user_id: userId, name: "To Shoot", position: 0 },
      { user_id: userId, name: "To Edit", position: 1 },
      { user_id: userId, name: "To Upload", position: 2 },
      { user_id: userId, name: "Done", position: 3 },
    ])
    .select();
  if (contentStatuses) {
    const [toShoot, toEdit, , done] = contentStatuses;
    await supabase.from("content_items").insert([
      { user_id: userId, status_id: toShoot.id, title: "Studio tour reel", platform: "Instagram", post_date: "2026-07-01" },
      { user_id: userId, status_id: toEdit.id, title: "Q&A long-form", platform: "YouTube", post_date: "2026-06-29" },
      { user_id: userId, status_id: done.id, title: "Behind the scenes", platform: "TikTok", post_date: "2026-06-22" },
    ]);
  }

  // Travel
  await supabase.from("travel_places").insert([
    { user_id: userId, name: "Kyoto, Japan", notes: "Cherry blossom season", visited: false },
    { user_id: userId, name: "Siargao, Philippines", notes: "Surfing trip with friends", visited: true },
    { user_id: userId, name: "Lisbon, Portugal", notes: "Tram rides and pastel de nata", visited: false },
  ]);

  await supabase.from("profiles").upsert({ id: userId, onboarded: true });
}
