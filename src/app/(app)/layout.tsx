import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { seedDemoContentIfNeeded } from "@/lib/seed";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Middleware already redirects unauthenticated requests, but a Server
  // Component guard keeps this layout safe to use on its own too.
  if (!user) redirect("/auth/signin");

  await seedDemoContentIfNeeded(supabase, user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Soft decorative blobs sitting under the glass cards, white base stays intact */}
      <div className="pointer-events-none fixed -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-alc-pink/30 blur-3xl" />
      <div className="pointer-events-none fixed -right-20 top-1/3 -z-10 h-80 w-80 rounded-full bg-alc-peach/30 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 left-1/3 -z-10 h-72 w-72 rounded-full bg-alc-coral/20 blur-3xl" />

      <Sidebar avatarUrl={profile?.avatar_url ?? null} displayName={profile?.display_name ?? null} />
      <main className="relative px-4 pb-24 pt-6 lg:ml-64 lg:px-10 lg:pb-10 lg:pt-8">{children}</main>
      <MobileNav />
    </div>
  );
}
