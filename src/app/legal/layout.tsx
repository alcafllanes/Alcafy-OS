import Link from "next/link";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link href="/auth/signup" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-alc-rose">
          ‹ Back
        </Link>
        {children}
      </div>
    </div>
  );
}
