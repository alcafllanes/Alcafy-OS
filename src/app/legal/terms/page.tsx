

const SECTIONS = [
  {
    title: "1. Your account",
    body: "You are responsible for keeping your login details safe and for any activity that happens under your account. Please let us know right away if you suspect someone else has access to it.",
  },
  {
    title: "2. Acceptable use",
    body: "Alcafy is meant for organizing your own personal life: finances, goals, tasks, study, journaling, content, and travel plans. Please do not use it to store or share content that is illegal, harmful, or violates the rights of others.",
  },
  {
    title: "3. Your content",
    body: "Everything you add, including journal entries, goals, images, and tasks, belongs to you. We do not claim ownership over your content, and we only access it to operate and improve the app or when you ask for support.",
  },
  {
    title: "4. Availability",
    body: "We aim to keep Alcafy available and reliable, but occasional maintenance or unexpected issues may cause short interruptions. We will do our best to keep these brief.",
  },
  {
    title: "5. Changes to these terms",
    body: "We may update these terms from time to time as Alcafy grows. If we make a meaningful change, we will let you know inside the app before it takes effect.",
  },
  {
    title: "6. Ending your account",
    body: "You can deactivate your account at any time from Settings. If you would like your data permanently deleted, contact support and we will take care of it.",
  },
];

export default function TermsPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-ink">Terms & Conditions</h1>
      <p className="mb-6 text-sm text-muted">The basics of using Alcafy, written in plain language.</p>
      <div className="glass-card flex flex-col gap-5 p-6 text-sm leading-relaxed text-ink dark:text-white">
        {SECTIONS.map((s) => (
          <div key={s.title}>
            <h3 className="mb-1.5 font-semibold">{s.title}</h3>
            <p className="text-muted">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
