"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Moon, Sun, SignOut, Warning, Camera } from "@phosphor-icons/react/dist/ssr";
import { createClient } from "@/lib/supabase/client";

type Prefs = {
  display_name: string;
  avatar_url: string | null;
  notifications_enabled: boolean;
  is_private: boolean;
  dark_mode: boolean;
};

export default function SettingsPanel({ userId, email, initial }: { userId: string; email: string; initial: Prefs }) {
  const router = useRouter();
  const supabase = createClient();
  const [prefs, setPrefs] = useState(initial);
  const [emailValue, setEmailValue] = useState(email);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [accountMsg, setAccountMsg] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", prefs.dark_mode);
    try {
      localStorage.setItem("alcafy-theme", prefs.dark_mode ? "dark" : "light");
    } catch {}
  }, [prefs.dark_mode]);

  async function persist(next: Partial<Prefs>) {
    const merged = { ...prefs, ...next };
    setPrefs(merged);
    setSaving(true);
    await supabase.from("profiles").upsert({ id: userId, ...merged });
    setSaving(false);
  }

  async function handleAvatarUpload(file: File) {
    const path = `${userId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file);
    if (error) return;
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    await persist({ avatar_url: pub.publicUrl });
    router.refresh();
  }

  async function handleAccountSave() {
    setAccountMsg(null);
    setSaving(true);
    const updates: { email?: string; password?: string } = {};
    if (emailValue && emailValue !== email) updates.email = emailValue;
    if (password) updates.password = password;

    if (Object.keys(updates).length) {
      const { error } = await supabase.auth.updateUser(updates);
      if (error) {
        setAccountMsg(error.message);
        setSaving(false);
        return;
      }
    }
    await supabase.from("profiles").upsert({ id: userId, display_name: prefs.display_name });
    setPassword("");
    setAccountMsg("Saved.");
    setSaving(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/auth/signin");
    router.refresh();
  }

  async function handleDeactivate() {
    const confirmed = window.confirm("Deactivate your account? You can contact support to reactivate it later.");
    if (!confirmed) return;
    await supabase.from("profiles").update({ is_private: true }).eq("id", userId);
    await supabase.auth.signOut();
    router.push("/auth/signin");
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Row 1: profile photo (left) + name/email/password (right) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="glass-card flex flex-col items-center justify-center gap-3 p-6">
          <label className="group relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-alc-pink bg-alc-cream">
            {prefs.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={prefs.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold text-alc-rose">{prefs.display_name?.[0]?.toUpperCase() ?? "?"}</span>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-opacity group-hover:bg-ink/35 group-hover:opacity-100">
              <Camera size={26} weight="bold" className="text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleAvatarUpload(file);
              }}
            />
          </label>
          <p className="text-xs text-muted">Hover your photo to change it</p>
        </div>

        <div className="glass-card flex flex-col gap-3 p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-muted">Account</h2>
          <Field label="Name" value={prefs.display_name} onChange={(v) => setPrefs((p) => ({ ...p, display_name: v }))} />
          <Field label="Email" value={emailValue} onChange={setEmailValue} type="email" />
          <Field label="New password" value={password} onChange={setPassword} type="password" placeholder="Leave blank to keep current password" />
          {accountMsg && <p className="text-xs text-alc-rose">{accountMsg}</p>}
          <button onClick={handleAccountSave} disabled={saving} className="btn-gradient w-fit text-sm disabled:opacity-60">
            {saving ? "Saving…" : "Save account"}
          </button>
        </div>
      </div>

      {/* Row 2: Notifications | Privacy */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section title="Notifications">
          <Row label="Push & email notifications">
            <Toggle checked={prefs.notifications_enabled} onChange={(v) => persist({ notifications_enabled: v })} />
          </Row>
        </Section>
        <Section title="Privacy">
          <Row label="Make profile private">
            <Toggle checked={prefs.is_private} onChange={(v) => persist({ is_private: v })} />
          </Row>
        </Section>
      </div>

      {/* Row 3: Appearance | Legal & Support */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Section title="Appearance">
          <Row label="Dark mode">
            <button
              onClick={() => persist({ dark_mode: !prefs.dark_mode })}
              className="flex items-center gap-2 rounded-glass-sm bg-alc-gradient px-3 py-1.5 text-xs font-medium text-white"
            >
              {prefs.dark_mode ? <Moon size={14} weight="bold" /> : <Sun size={14} weight="bold" />}
              {prefs.dark_mode ? "Dark" : "Light"}
            </button>
          </Row>
        </Section>
        <Section title="Legal & support">
          <Row label="Privacy policy">
            <Link href="/settings/privacy" className="text-sm font-medium text-alc-rose">
              View
            </Link>
          </Row>
          <Row label="Terms & conditions">
            <Link href="/settings/terms" className="text-sm font-medium text-alc-rose">
              View
            </Link>
          </Row>
          <Row label="Help">
            <Link href="/settings/help" className="text-sm font-medium text-alc-rose">
              View
            </Link>
          </Row>
        </Section>
      </div>

      {/* Row 4: sign out + deactivate */}
      <div className="glass-card flex flex-col gap-3 p-5">
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 rounded-glass-sm border border-alc-rose/50 py-2.5 text-sm font-medium text-alc-rose"
        >
          <SignOut size={16} weight="bold" /> Sign out
        </button>
        <button
          onClick={handleDeactivate}
          className="flex items-center justify-center gap-2 rounded-glass-sm py-2.5 text-sm font-medium text-muted hover:text-alc-rose"
        >
          <Warning size={16} weight="bold" /> Deactivate account
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-5">
      <h2 className="mb-3 text-sm font-semibold text-muted">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ink dark:text-white">{label}</span>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`h-6 w-11 rounded-full transition-colors ${checked ? "bg-alc-gradient" : "bg-alc-cream"}`}
    >
      <span
        className={`block h-5 w-5 translate-x-0.5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : ""
        }`}
      />
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-glass-sm border border-alc-pink/50 bg-white/70 px-3.5 py-2.5 text-sm text-ink outline-none focus:border-alc-rose"
      />
    </div>
  );
}
