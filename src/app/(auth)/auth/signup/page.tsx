"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!agreed) {
      setError("Please agree to the Terms & Conditions and Privacy Policy to continue.");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    await supabase.from("profiles").upsert({ id: data.user.id, display_name: name });

    setLoading(false);
    router.push("/home");
    router.refresh();
  }

  return (
    <div>
      <h2 className="mb-5 text-lg font-semibold text-ink">Create your account</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Name</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-glass-sm border border-alc-pink/50 bg-white/70 px-4 py-2.5 text-sm text-ink outline-none focus:border-alc-rose"
            placeholder="Your name"
          />
        </div>
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-glass-sm border border-alc-pink/50 bg-white/70 px-4 py-2.5 text-sm text-ink outline-none focus:border-alc-rose"
            placeholder="At least 6 characters"
          />
        </div>

        <label className="flex items-start gap-2.5 text-xs text-muted">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-alc-pink text-alc-rose accent-[#E981A4]"
          />
          <span>
            I agree to the{" "}
            <Link href="/legal/terms" target="_blank" className="font-medium text-alc-rose">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" target="_blank" className="font-medium text-alc-rose">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {error && <p className="text-xs text-alc-rose">{error}</p>}
        <button type="submit" disabled={loading} className="btn-gradient mt-1 w-full disabled:opacity-60">
          {loading ? "Creating account…" : "Sign up"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/auth/signin" className="font-medium text-alc-rose">
          Sign in
        </Link>
      </p>
    </div>
  );
}
