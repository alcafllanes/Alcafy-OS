"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import EditableCard from "@/components/EditableCard";
import Modal from "@/components/Modal";
import AddButton from "@/components/AddButton";

type Goal = {
  id: string;
  title: string;
  note: string | null;
  target_date: string | null;
  progress: number | null;
  image_url: string | null;
};

const EMPTY: Goal = { id: "", title: "", note: "", target_date: "", progress: 0, image_url: null };

export default function GoalsBoard({ initialGoals, userId }: { initialGoals: Goal[]; userId: string }) {
  const supabase = createClient();
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [isNew, setIsNew] = useState(false);

  function openNew() {
    setEditing({ ...EMPTY });
    setIsNew(true);
  }

  function openEdit(g: Goal) {
    setEditing({ ...g });
    setIsNew(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (isNew) {
      const { data } = await supabase
        .from("goals")
        .insert({
          user_id: userId,
          title: editing.title || "Untitled goal",
          note: editing.note,
          target_date: editing.target_date || null,
          progress: editing.progress ?? 0,
        })
        .select()
        .single();
      if (data) setGoals((g) => [...g, data as Goal]);
    } else {
      await supabase
        .from("goals")
        .update({
          title: editing.title,
          note: editing.note,
          target_date: editing.target_date || null,
          progress: editing.progress,
        })
        .eq("id", editing.id);
      setGoals((g) => g.map((item) => (item.id === editing.id ? editing : item)));
    }
    setEditing(null);
  }

  async function handleDelete(id: string) {
    setGoals((g) => g.filter((item) => item.id !== id));
    await supabase.from("goals").delete().eq("id", id);
  }

  return (
    <div>
      <div className="mb-5 flex justify-end">
        <AddButton label="Add goal" onClick={openNew} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {goals.map((g) => (
          <EditableCard key={g.id} onClick={() => openEdit(g)} onDelete={() => handleDelete(g.id)}>
            <div className="h-36 w-full bg-alc-gradient-soft">
              {g.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.image_url} alt={g.title} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-ink">{g.title}</h3>
              {g.note && <p className="mt-1 text-sm text-muted">{g.note}</p>}
              <div className="mt-3 flex items-center justify-between text-xs text-muted">
                {g.target_date && <span>By {new Date(g.target_date).toLocaleDateString()}</span>}
                <span>{g.progress ?? 0}% there</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-alc-cream">
                <div className="h-full rounded-full bg-alc-gradient" style={{ width: `${g.progress ?? 0}%` }} />
              </div>
            </div>
          </EditableCard>
        ))}

        <button
          onClick={openNew}
          className="glass-card flex min-h-[220px] flex-col items-center justify-center gap-2 border-2 border-dashed border-alc-pink text-alc-rose"
        >
          <span className="text-2xl">+</span>
          <span className="text-sm font-medium">New goal</span>
        </button>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "Add goal" : "Edit goal"}>
        {editing && (
          <div className="flex flex-col gap-3">
            <Field label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Note / why</label>
              <textarea
                rows={3}
                value={editing.note ?? ""}
                onChange={(e) => setEditing({ ...editing, note: e.target.value })}
                className="w-full resize-none rounded-glass-sm border border-alc-pink/50 bg-white/70 p-3 text-sm text-ink outline-none focus:border-alc-rose"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Target date</label>
                <input
                  type="date"
                  value={editing.target_date ?? ""}
                  onChange={(e) => setEditing({ ...editing, target_date: e.target.value })}
                  className="w-full rounded-glass-sm border border-alc-pink/50 bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-alc-rose"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Progress %</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editing.progress ?? 0}
                  onChange={(e) => setEditing({ ...editing, progress: Number(e.target.value) })}
                  className="w-full rounded-glass-sm border border-alc-pink/50 bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-alc-rose"
                />
              </div>
            </div>
            <button onClick={handleSave} className="btn-gradient mt-2 text-sm">
              Save goal
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-glass-sm border border-alc-pink/50 bg-white/70 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-alc-rose"
      />
    </div>
  );
}
