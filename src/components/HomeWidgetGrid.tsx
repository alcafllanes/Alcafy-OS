"use client";

import { useRef, useState } from "react";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/client";

type Widget = { id: string; image_url: string; pos_x: number; pos_y: number };

export default function HomeWidgetGrid({ initialWidgets, userId }: { initialWidgets: Widget[]; userId: string }) {
  const supabase = createClient();
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragId = useRef<string | null>(null);

  async function handleUpload(file: File) {
    const path = `${userId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("home-images").upload(path, file);
    if (error) return;
    const { data: pub } = supabase.storage.from("home-images").getPublicUrl(path);
    const { data: row } = await supabase
      .from("home_widgets")
      .insert({ user_id: userId, image_url: pub.publicUrl, pos_x: 0, pos_y: 0 })
      .select()
      .single();
    if (row) setWidgets((w) => [...w, row as Widget]);
  }

  function onDragStart(id: string) {
    dragId.current = id;
  }

  async function onDropAt(e: React.DragEvent<HTMLDivElement>) {
    const id = dragId.current;
    if (!id) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    setWidgets((w) => w.map((item) => (item.id === id ? { ...item, pos_x: x, pos_y: y } : item)));
    await supabase.from("home_widgets").update({ pos_x: x, pos_y: y }).eq("id", id);
    dragId.current = null;
  }

  async function handleDelete(id: string) {
    setWidgets((w) => w.filter((item) => item.id !== id));
    await supabase.from("home_widgets").delete().eq("id", id);
  }

  return (
    <div
      className="glass-panel relative min-h-[320px] w-full overflow-hidden p-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDropAt}
    >
      {widgets.map((w) => (
        <div
          key={w.id}
          draggable
          onDragStart={() => onDragStart(w.id)}
          style={{ position: "absolute", left: w.pos_x, top: w.pos_y }}
          className="editable-card group h-28 w-28 cursor-grab overflow-hidden rounded-glass-sm border border-white/50 shadow-glass active:cursor-grabbing"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(w.id);
            }}
            className="card-delete-btn"
          >
            <X size={13} weight="bold" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={w.image_url} alt="" className="h-full w-full object-cover" />
        </div>
      ))}

      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex h-28 w-28 items-center justify-center rounded-glass-sm border-2 border-dashed border-alc-pink bg-white/50 text-alc-rose transition-colors hover:bg-alc-pink/20"
      >
        <Plus size={24} weight="bold" />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
    </div>
  );
}
