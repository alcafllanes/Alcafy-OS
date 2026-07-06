"use client";

import { useState } from "react";
import KanbanBoard, { type KanbanCard, type KanbanStatus } from "@/components/KanbanBoard";
import Modal from "@/components/Modal";
import { createClient } from "@/lib/supabase/client";

export default function ContentBoard({
  initialStatuses,
  initialCards,
  userId,
}: {
  initialStatuses: KanbanStatus[];
  initialCards: KanbanCard[];
  userId: string;
}) {
  const supabase = createClient();
  const [statuses, setStatuses] = useState(initialStatuses);
  const [cards, setCards] = useState(initialCards);
  const [editing, setEditing] = useState<KanbanCard | null>(null);

  async function handleMove(cardId: string, toStatusId: string) {
    setCards((c) => c.map((t) => (t.id === cardId ? { ...t, statusId: toStatusId } : t)));
    await supabase.from("content_items").update({ status_id: toStatusId }).eq("id", cardId);
  }

  async function handleAddStatus(name: string) {
    const { data } = await supabase.from("content_statuses").insert({ user_id: userId, name }).select().single();
    if (data) setStatuses((s) => [...s, { id: data.id, name: data.name }]);
  }

  async function handleRenameStatus(statusId: string, name: string) {
    setStatuses((s) => s.map((st) => (st.id === statusId ? { ...st, name } : st)));
    await supabase.from("content_statuses").update({ name }).eq("id", statusId);
  }

  async function handleDeleteStatus(statusId: string) {
    setStatuses((s) => s.filter((st) => st.id !== statusId));
    setCards((c) => c.filter((card) => card.statusId !== statusId));
    await supabase.from("content_statuses").delete().eq("id", statusId);
  }

  async function handleAddCard(statusId: string) {
    const { data } = await supabase
      .from("content_items")
      .insert({ user_id: userId, status_id: statusId, title: "Untitled idea" })
      .select()
      .single();
    if (data) {
      setCards((c) => [...c, { id: data.id, statusId: data.status_id, title: data.title, meta: data.platform }]);
    }
  }

  async function handleDeleteCard(cardId: string) {
    setCards((c) => c.filter((t) => t.id !== cardId));
    await supabase.from("content_items").delete().eq("id", cardId);
  }

  async function handleSaveEdit() {
    if (!editing) return;
    setCards((c) => c.map((t) => (t.id === editing.id ? editing : t)));
    await supabase
      .from("content_items")
      .update({
        title: editing.title,
        platform: editing.meta,
        post_date: editing.dateLabel ? editing.dateLabel : null,
        notes: editing.description,
      })
      .eq("id", editing.id);
    setEditing(null);
  }

  return (
    <>
      <KanbanBoard
        statuses={statuses}
        cards={cards}
        onMove={handleMove}
        onAddStatus={handleAddStatus}
        onRenameStatus={handleRenameStatus}
        onDeleteStatus={handleDeleteStatus}
        onAddCard={handleAddCard}
        onDeleteCard={handleDeleteCard}
        onCardClick={(card) => setEditing(card)}
      />

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit content">
        {editing && (
          <div className="flex flex-col gap-3">
            <LabeledInput label="Title" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
            <LabeledInput label="Platform" value={editing.meta ?? ""} onChange={(v) => setEditing({ ...editing, meta: v })} />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Post date</label>
              <input
                type="date"
                value={editing.dateLabel ?? ""}
                onChange={(e) => setEditing({ ...editing, dateLabel: e.target.value })}
                className="w-full rounded-glass-sm border border-alc-pink/50 bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-alc-rose"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Notes</label>
              <textarea
                rows={3}
                value={editing.description ?? ""}
                onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                className="w-full resize-none rounded-glass-sm border border-alc-pink/50 bg-white/70 p-3 text-sm text-ink outline-none focus:border-alc-rose"
              />
            </div>
            <button onClick={handleSaveEdit} className="btn-gradient mt-2 text-sm">
              Save content
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}

function LabeledInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
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
