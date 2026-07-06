"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import EditableCard from "@/components/EditableCard";
import Modal from "@/components/Modal";
import AddButton from "@/components/AddButton";
import { Image as ImageIcon, X } from "@phosphor-icons/react/dist/ssr";

type Place = { id: string; name: string; notes: string | null; visited: boolean; image_url: string | null };
const EMPTY: Place = { id: "", name: "", notes: "", visited: false, image_url: null };

export default function TravelBoard({ initialPlaces, userId }: { initialPlaces: Place[]; userId: string }) {
  const supabase = createClient();
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [editing, setEditing] = useState<Place | null>(null);
  const [isNew, setIsNew] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  function openNew(visited: boolean) {
    setEditing({ ...EMPTY, visited });
    setIsNew(true);
  }
  function openEdit(p: Place) {
    setEditing({ ...p });
    setIsNew(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (isNew) {
      const { data } = await supabase
        .from("travel_places")
        .insert({ user_id: userId, name: editing.name || "Untitled place", notes: editing.notes, visited: editing.visited, image_url: editing.image_url })
        .select()
        .single();
      if (data) setPlaces((p) => [...p, data as Place]);
    } else {
      await supabase
        .from("travel_places")
        .update({ name: editing.name, notes: editing.notes, visited: editing.visited, image_url: editing.image_url })
        .eq("id", editing.id);
      setPlaces((p) => p.map((item) => (item.id === editing.id ? editing : item)));
    }
    setEditing(null);
  }

  async function handleDelete(id: string) {
    setPlaces((p) => p.filter((item) => item.id !== id));
    await supabase.from("travel_places").delete().eq("id", id);
  }

  async function handleImageUpload(file: File) {
    if (!editing) return;
    const path = `${userId}/travel-${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("home-images").upload(path, file);
    if (error) return;
    const { data: pub } = supabase.storage.from("home-images").getPublicUrl(path);
    setEditing({ ...editing, image_url: pub.publicUrl });
  }

  const Section = ({ title, visited }: { title: string; visited: boolean }) => {
    const items = places.filter((p) => p.visited === visited);
    return (
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted">{title}</h2>
          <AddButton label="Add place" onClick={() => openNew(visited)} />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <EditableCard key={p.id} onClick={() => openEdit(p)} onDelete={() => handleDelete(p.id)}>
              <div className="h-32 w-full bg-alc-gradient-soft">
                {p.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-ink">{p.name}</h3>
                {p.notes && <p className="mt-1 text-sm text-muted">{p.notes}</p>}
              </div>
            </EditableCard>
          ))}
          {!items.length && <p className="text-sm text-muted">Nothing here yet.</p>}
        </div>
      </div>
    );
  };

  return (
    <div>
      <Section title="Dream destinations" visited={false} />
      <Section title="Places I've been" visited={true} />

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? "Add place" : "Edit place"}>
        {editing && (
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Place name</label>
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="w-full rounded-glass-sm border border-alc-pink/50 bg-white/70 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-alc-rose"
              />
            </div>

            {editing.image_url && (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={editing.image_url} alt="" className="max-h-40 w-full rounded-glass-sm object-cover" />
                <button
                  onClick={() => setEditing({ ...editing, image_url: null })}
                  className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-alc-rose shadow-glass"
                >
                  <X size={13} weight="bold" />
                </button>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Notes</label>
              <textarea
                rows={3}
                value={editing.notes ?? ""}
                onChange={(e) => setEditing({ ...editing, notes: e.target.value })}
                className="w-full resize-none rounded-glass-sm border border-alc-pink/50 bg-white/70 p-3 text-sm text-ink outline-none focus:border-alc-rose"
              />
            </div>

            <div>
              <button
                onClick={() => fileInput.current?.click()}
                className="flex items-center gap-1.5 rounded-glass-sm border border-alc-pink/50 px-3 py-1.5 text-xs font-medium text-alc-rose hover:bg-alc-pink/10"
              >
                <ImageIcon size={15} weight="bold" /> {editing.image_url ? "Replace cover photo" : "Add cover photo"}
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">Status</label>
              <select
                value={editing.visited ? "visited" : "destination"}
                onChange={(e) => setEditing({ ...editing, visited: e.target.value === "visited" })}
                className="w-full rounded-glass-sm border border-alc-pink/50 bg-white/70 px-3 py-2 text-sm text-ink outline-none focus:border-alc-rose"
              >
                <option value="destination">Travel destination</option>
                <option value="visited">Visited</option>
              </select>
            </div>

            <button onClick={handleSave} className="btn-gradient mt-2 text-sm">
              Save place
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
