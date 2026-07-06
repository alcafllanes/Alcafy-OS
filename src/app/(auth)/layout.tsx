export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-12">
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-glass bg-alc-gradient text-2xl font-bold text-white shadow-glass">
          A
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Alcafy</h1>
        <p className="mt-1.5 text-sm text-muted">Your life, organized.</p>
      </div>

      <div className="relative w-full max-w-sm">
        {/* Mascot peeking over the top-left edge of the card */}
        <img
          src="/brand/bear-auth.png"
          alt=""
          aria-hidden
          className="absolute left-[3%] top-0 z-10 h-16 w-16 select-none"
          style={{ transform: "translateY(-86%)" }}
        />
        <div className="glass-card w-full p-7 pt-8">{children}</div>
      </div>
    </div>
  );
}
