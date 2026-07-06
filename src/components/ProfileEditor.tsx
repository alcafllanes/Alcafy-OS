"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/client";

type ProfileData = {
  display_name: string;
  title: string;
  location: string;
  bio: string;
  avatar_url: string | null;
  banner_url: string | null;
};

export default function ProfileEditor({ userId, initial }: { userId: string; initial: ProfileData }) {
  const router = useRouter();
  const supabase = createClient();
  const [data, setData] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function uploadTo(bucket: string, file: File) {
    const path = `${userId}/${Date.now()}-${file.name}`;
    await supabase.storage.from(bucket).upload(path, file);
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    return pub.publicUrl;
  }

  async function handleSave() {
    setSaving(true);
    await supabase.from("profiles").upsert({ id: userId, ...data });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Banner */}
      <div className="relative h-40 w-full bg-alc-gradient-soft">
        {data.banner_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.banner_url} alt="" className="h-full w-full object-cover" />
        )}
        <label className="absolute right-3 top-3 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/80 text-alc-rose shadow-glass">
          <Camera size={18} weight="bold" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await uploadTo("banners", file);
              setData((d) => ({ ...d, banner_url: url }));
            }}
          />
        </label>

        {/* Avatar overlapping banner */}
        <label className="absolute -bottom-8 left-6 flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border-4 border-white bg-alc-cream">
          {data.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.avatar_url} alt="" className="h-full w-full object-cover" />
          ) : (
            <Camera size={20} weight="bold" className="text-alc-rose" />
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = await uploadTo("avatars", file);
              setData((d) => ({ ...d, avatar_url: url }));
            }}
          />
        </label>
      </div>

      <div className="px-6 pb-6 pt-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name" value={data.display_name} onChange={(v) => setData((d) => ({ ...d, display_name: v }))} />
          <Field label="Title / role" value={data.title} onChange={(v) => setData((d) => ({ ...d, title: v }))} />
          <Field label="Location" value={data.location} onChange={(v) => setData((d) => ({ ...d, location: v }))} />
        </div>
        <div className="mt-4">
          <label className="mb-1.5 block text-xs font-medium text-muted">Bio</label>
          <textarea
            rows={3}
            value={data.bio}
            onChange={(e) => setData((d) => ({ ...d, bio: e.target.value }))}
            className="w-full resize-none rounded-glass-sm border border-alc-pink/50 bg-white/70 p-3 text-sm text-ink outline-none focus:border-alc-rose"
          />
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-gradient mt-4 text-sm disabled:opacity-60">
          {saving ? "Saving…" : "Save profile"}
        </button>
      </div>
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
