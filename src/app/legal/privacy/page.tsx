

const SECTIONS = [
  {
    title: "1. What we collect",
    body: "We collect the information you choose to add to Alcafy: your name, profile photo, goals, finances, tasks, journal entries, content plans, and travel notes. We also collect basic account details like your email address.",
  },
  {
    title: "2. How we use your information",
    body: "Your information is used only to show your own data back to you, to keep your account secure, and to improve how Alcafy works. We do not sell your personal information.",
  },
  {
    title: "3. Who can see your information",
    body: "Only you can see your personal data inside Alcafy. If you turn on the private profile option in Settings, even less of your information is visible to others.",
  },
  {
    title: "4. How your information is stored",
    body: "Your data is stored on secure, access controlled infrastructure. Images and files you upload, like profile photos and thumbnails, are also kept securely and tied to your account only.",
  },
  {
    title: "5. Your choices",
    body: "You can edit or delete most of your information directly inside the app at any time. You can also deactivate your account from Settings, or contact us if you would like your data fully removed.",
  },
  {
    title: "6. Changes to this policy",
    body: "If we make meaningful changes to how we handle your information, we will let you know inside the app before the change takes effect.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-semibold text-ink">Privacy Policy</h1>
      <p className="mb-6 text-sm text-muted">How your information is collected, used, and protected.</p>
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
