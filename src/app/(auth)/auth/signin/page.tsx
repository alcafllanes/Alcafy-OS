"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/home");
    router.refresh();
  }

  return (
    <div>
      <h2 className="mb-5 text-lg font-semibold text-ink">Welcome back</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-glass-sm border border-alc-pink/50 bg-white/70 px-4 py-2.5 text-sm text-ink outline-none focus:border-alc-rose"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-glass-sm border border-alc-pink/50 bg-white/70 px-4 py-2.5 text-sm text-ink outline-none focus:border-alc-rose"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-xs text-alc-rose">{error}</p>}
        <button type="submit" disabled={loading} className="btn-gradient mt-1 w-full disabled:opacity-60">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">
        New to Alcafy?{" "}
        <Link href="/auth/signup" className="font-medium text-alc-rose">
          Create an account
        </Link>
      </p>
    </div>
  );
}
