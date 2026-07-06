import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/PageHeader";
import StudyHubBoard from "@/components/StudyHubBoard";

export default async function StudyHubPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: subjects } = await supabase.from("subjects").select("*, subject_items(*)").eq("user_id", user?.id);
  const { data: certs } = await supabase.from("certifications").select("*").eq("user_id", user?.id);
  const { data: profile } = await supabase
    .from("profiles")
    .select("study_total_semesters, study_completed_semesters")
    .eq("id", user?.id)
    .single();

  const subjectList = (subjects ?? []).map((s: any) => ({ ...s, items: s.subject_items ?? [] }));

  return (
    <div>
      <PageHeader title="Study Hub" subtitle="Subjects, assignments, exams, and certifications." />
      <StudyHubBoard
        initialSubjects={subjectList as any}
        initialCerts={(certs ?? []) as any}
        userId={user?.id ?? ""}
        initialTotalSemesters={profile?.study_total_semesters ?? 0}
        initialCompletedSemesters={profile?.study_completed_semesters ?? 0}
      />
    </div>
  );
}
