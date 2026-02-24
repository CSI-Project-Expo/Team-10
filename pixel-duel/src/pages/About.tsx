import { Navbar } from "@/components/Navbar";

const pillars = [
  {
    title: "Real-time duels",
    body: "Battle live with low-latency sockets, synced timers, and instant judge feedback.",
  },
  {
    title: "Competitive ladder",
    body: "Climb an Elo-powered ladder, track streaks, and push for seasonal rewards.",
  },
  {
    title: "Practice that counts",
    body: "Run problems locally, then submit to lock in rating changes once you’re confident.",
  },
  {
    title: "Communities",
    body: "Join guilds, organize scrims, and compare progress with teammates.",
  },
];

const stats = [
  { label: "Daily duels", value: "89k" },
  { label: "Active duelers", value: "12.8k" },
  { label: "Avg. queue", value: "4.2s" },
  { label: "Problems", value: "420+" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 pt-24 pb-16">
        <header className="max-w-4xl space-y-4">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            About CodeDuel
          </span>
          <h1 className="text-4xl font-black text-foreground sm:text-5xl">
            The fastest way to sharpen your problem-solving under pressure.
          </h1>
          <p className="text-lg text-muted-foreground">
            CodeDuel blends competitive adrenaline with practical skill growth. Instant judging,
            fair matchmaking, and a transparent rating system keep every duel meaningful.
          </p>
        </header>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          {pillars.map((item) => (
            <div key={item.title} className="glass-card p-5">
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.body}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <div className="text-3xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="glass-card p-6 space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Fair play & transparency</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Elo updates are tied to verified submissions only. We surface every test, runtime, and
              failure reason so you know exactly how your rating moves. Anti-cheat signals like
              abnormal paste patterns and multi-tab detection help keep the ladder clean.
            </p>
            <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
              <li>Deterministic judge runs with capped execution time.</li>
              <li>Language parity across JavaScript, Python, Java, and C++.</li>
              <li>Replayable submissions for dispute resolution.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
            <h3 className="text-lg font-semibold text-foreground">Built for teams</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Run scrims, set custom lobbies, and share curated problem sets. Team captains can pin
              match windows and track member streaks in real time.
            </p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Lobby size</span>
                <span className="font-mono text-foreground">2-10</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Custom problems</span>
                <span className="font-mono text-foreground">Yes</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Private brackets</span>
                <span className="font-mono text-foreground">Yes</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
