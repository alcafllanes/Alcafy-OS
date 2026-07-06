"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Modal from "@/components/Modal";
import EditableCard from "@/components/EditableCard";
import AddButton from "@/components/AddButton";
import { MOODS, moodIcon, moodLabel } from "@/lib/moods";
import { Image as ImageIcon, ArrowsOut, ArrowsIn, X } from "@phosphor-icons/react/dist/ssr";

type Entry = { id: string; mood: string; body: string; entry_date: string; image_url?: string | null };

export default function JournalBoard({ initialEntries, userId }: { initialEntries: Entry[]; userId: string }) {
  const supabase = createClient();
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [mood, setMood] = useState("happy");
  const [body, setBody] = useState("");
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [wideView, setWideView] = useState(false);
  const composerFileInput = useRef<HTMLInputElement>(null);
  const editFileInput = useRef<HTMLInputElement>(null);

  async function uploadImage(file: File) {
    const path = `${userId}/journal-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("home-images").upload(path, file);
    if (error) return null;
    const { data: pub } = supabase.storage.from("home-images").getPublicUrl(path);
    return pub.publicUrl;
  }

  async function handleAdd() {
    if (!body.trim()) return;
    setSaving(true);
    const { data } = await supabase
      .from("journal_entries")
      .insert({ user_id: userId, mood, body, image_url: pendingImage, entry_date: new Date().toISOString().slice(0, 10) })
      .select()
      .single();
    if (data) setEntries((e) => [data as Entry, ...e]);
    setBody("");
    setPendingImage(null);
    setSaving(false);
  }

  async function handleSaveEdit() {
    if (!editing) return;
    await supabase
      .from("journal_entries")
      .update({ mood: editing.mood, body: editing.body, entry_date: editing.entry_date, image_url: editing.image_url })
      .eq("id", editing.id);
    setEntries((e) => e.map((item) => (item.id === editing.id ? editing : item)));
    setEditing(null);
    setWideView(false);
  }

  async function handleDelete(id: string) {
    setEntries((e) => e.filter((item) => item.id !== id));
    await supabase.from("journal_entries").delete().eq("id", id);
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <div className="glass-card p-5">
          <h2 className="mb-3 text-sm font-semibold text-muted">How are you feeling?</h2>
          <div className="mb-4 flex justify-between">
            {MOODS.map((m) => (
              <button
                key={m.key}
                onClick={() => setMood(m.key)}
                className={`flex flex-col items-center gap-1 rounded-glass-sm px-1.5 py-1.5 transition-transform ${
                  mood === m.key ? "scale-110 bg-alc-pink/30" : "opacity-60"
                }`}
                aria-label={m.label}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.icon} alt={m.label} className="h-9 w-9 object-contain" />
              </button>
            ))}
          </div>
          <textarea
            id="journal-textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write whatever's on your mind…"
            rows={6}
            className="w-full resize-none rounded-glass-sm border border-alc-pink/50 bg-white/70 p-3 text-sm text-ink outline-none focus:border-alc-rose"
          />

          {pendingImage && (
            <div className="relative mt-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pendingImage} alt="" className="max-h-40 w-full rounded-glass-sm object-cover" />
              <button
                onClick={() => setPendingImage(null)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-alc-rose shadow-glass"
              >
                <X size={13} weight="bold" />
              </button>
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => composerFileInput.current?.click()}
              className="flex items-center gap-1.5 rounded-glass-sm border border-alc-pink/50 px-3 py-1.5 text-xs font-medium text-alc-rose hover:bg-alc-pink/10"
            >
              <ImageIcon size={15} weight="bold" /> Add picture
            </button>
            <input
              ref={composerFileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const url = await uploadImage(file);
                if (url) setPendingImage(url);
              }}
            />
          </div>

          <button onClick={handleAdd} disabled={saving} className="btn-gradient mt-3 w-full text-sm disabled:opacity-60">
            {saving ? "Saving…" : "Save entry"}
          </button>
        </div>
      </div>

      <div className="glass-card p-5 lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted">Past entries</h2>
          <AddButton label="Add entry" onClick={() => document.getElementById("journal-textarea")?.focus()} />
        </div>
        <ul className="flex flex-col gap-3">
          {entries.map((e) => (
            <EditableCard key={e.id} onClick={() => setEditing({ ...e })} onDelete={() => handleDelete(e.id)} className="!shadow-none">
              <div className="flex items-start gap-3 p-4">
                {e.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.image_url} alt="" className="h-12 w-12 shrink-0 rounded-glass-sm object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={moodIcon(e.mood)} alt={moodLabel(e.mood)} className="h-9 w-9 shrink-0 object-contain" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-muted">
                    <span className="font-medium text-alc-rose">{moodLabel(e.mood)}</span>
                    <span>{new Date(e.entry_date).toLocaleDateString()}</span>
                  </div>
                  <p className="mt-1.5 text-sm text-ink">{e.body}</p>
                </div>
              </div>
            </EditableCard>
          ))}
          {!entries.length && <p className="text-sm text-muted">No entries yet. Write your first one.</p>}
        </ul>
      </div>

      <Modal
        open={!!editing}
        onClose={() => {
          setEditing(null);
          setWideView(false);
        }}
        title="Edit entry"
        maxWidthClass={wideView ? "max-w-2xl" : "max-w-md"}
        headerActions={
          <button
            onClick={() => setWideView((w) => !w)}
            className="rounded-full p-1.5 text-muted hover:bg-alc-pink/20 hover:text-ink"
            title={wideView ? "Switch to compact view" : "Switch to wide view"}
          >
            {wideView ? <ArrowsIn size={18} weight="bold" /> : <ArrowsOut size={18} weight="bold" />}
          </button>
        }
      >
        {editing && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              {MOODS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setEditing({ ...editing, mood: m.key })}
                  className={`flex flex-col items-center gap-1 rounded-glass-sm px-1.5 py-1.5 transition-transform ${
                    editing.mood === m.key ? "scale-110 bg-alc-pink/30" : "opacity-60"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.icon} alt={m.label} className="h-9 w-9 object-contain" />
                </button>
              ))}
            </div>

            {editing.image_url && (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editing.image_url}
                  alt=""
                  className={`w-full rounded-glass-sm object-cover ${wideView ? "max-h-96" : "max-h-48"}`}
                />
                <button
                  onClick={() => setEditing({ ...editing, image_url: null })}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-alc-rose shadow-glass"
                >
                  <X size={13} weight="bold" />
                </button>
              </div>
            )}

            <textarea
              rows={wideView ? 10 : 5}
              value={editing.body}
              onChange={(e) => setEditing({ ...editing, body: e.target.value })}
              className="w-full resize-none rounded-glass-sm border border-alc-pink/50 bg-white/70 p-3 text-sm text-ink outline-none focus:border-alc-rose"
            />

            <div className="flex items-center gap-2">
              <button
                onClick={() => editFileInput.current?.click()}
                className="flex items-center gap-1.5 rounded-glass-sm border border-alc-pink/50 px-3 py-1.5 text-xs font-medium text-alc-rose hover:bg-alc-pink/10"
              >
                <ImageIcon size={15} weight="bold" /> {editing.image_url ? "Replace picture" : "Add picture"}
              </button>
              <input
                ref={editFileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const url = await uploadImage(file);
                  if (url) setEditing({ ...editing, image_url: url });
                }}
              />
            </div>

            <button onClick={handleSaveEdit} className="btn-gradient mt-1 text-sm">
              Save changes
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
