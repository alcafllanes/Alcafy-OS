import PageHeader from "@/components/PageHeader";

const FAQS = [
  {
    q: "How do I add something new to a page?",
    a: "Look for the rounded \"+\" button on pages like Goals, Travel, Workspace, and Content. It opens a small form so you can add a new card without leaving the page.",
  },
  {
    q: "How do I edit or delete a card?",
    a: "Click any card to open it and edit the details. To delete a card, hover over it, a small circular x appears in the corner, click it to remove the card.",
  },
  {
    q: "Can I rename or remove a Workspace or Content column?",
    a: "Yes. Click a column title to rename it, or use the small menu on the column to delete it. You can also add new columns any time.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your information is stored securely and only your account can see your finances, goals, journal entries, and other personal data.",
  },
  {
    q: "How do I switch between light and dark mode?",
    a: "Go to Settings, then Appearance, and tap the toggle. Your preference is saved to your account automatically.",
  },
  {
    q: "How do I update my profile photo or name?",
    a: "Go to Settings. Hover over your profile photo to upload a new one, and edit your name, email, or password from the same page.",
  },
  {
    q: "What happens if I deactivate my account?",
    a: "Deactivating signs you out and marks your profile as inactive. Your data is kept safe, reach out to support if you would like to reactivate later.",
  },
  {
    q: "I think I found a bug. What should I do?",
    a: "Thank you for letting us know. Please describe what happened and we will look into it as soon as possible.",
  },
];

export default function HelpPage() {
  return (
    <div>
      <PageHeader title="Help" subtitle="Answers to common questions about using Alcafy." />
      <div className="flex flex-col gap-3">
        {FAQS.map((f) => (
          <details key={f.q} className="glass-card group p-4 open:pb-4">
            <summary className="cursor-pointer list-none font-medium text-ink dark:text-white">
              <span className="mr-2 inline-block text-alc-rose transition-transform group-open:rotate-90">›</span>
              {f.q}
            </summary>
            <p className="mt-2 pl-5 text-sm text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      <div className="glass-card mt-6 flex flex-col items-start gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Still need a hand? Reach out any time and our team will help you sort it out.
        </p>
        <a href="mailto:helloalcaos@gmail.com" className="btn-gradient shrink-0 text-sm">
          Email us
        </a>
      </div>
    </div>
  );
}
