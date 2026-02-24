import { Navbar } from "@/components/Navbar";

const communities = [
  {
    name: "Algo Knights",
    members: 842,
    focus: "Daily ladders & weekly scrims",
    tags: ["DSA", "Speed"],
  },
  {
    name: "Functional Fellows",
    members: 410,
    focus: "FP problems, clean code reviews",
    tags: ["FP", "Code quality"],
  },
  {
    name: "Night Owls",
    members: 612,
    focus: "Late-night duels across timezones",
    tags: ["Global", "No tilt"],
  },
  {
    name: "Rustacean Rush",
    members: 233,
    focus: "Rust-only duels and borrow-checker drills",
    tags: ["Rust", "Systems"],
  },
];

export default function Community() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 pt-24 pb-16">
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Community
          </span>
          <h1 className="text-4xl font-black text-foreground sm:text-5xl">
            Find your squad, scrim together, climb faster.
          </h1>
          <p className="text-lg text-muted-foreground">
            Join a community, queue for private lobbies, or host weekly brackets. Everything is set up with dummy data so you can explore the flow immediately.
          </p>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {communities.map((c) => (
            <div key={c.name} className="glass-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.focus}</p>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground">
                  {c.members} members
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {c.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-primary/10 px-2 py-1 text-primary">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                  Join
                </button>
                <button className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground transition hover:bg-muted">
                  View schedule
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
