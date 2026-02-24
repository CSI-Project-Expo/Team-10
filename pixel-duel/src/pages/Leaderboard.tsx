import { Navbar } from "@/components/Navbar";

const players = [
  { name: "CodePhoenix", elo: 1890, region: "NA", streak: 6 },
  { name: "AlgoKnight", elo: 1835, region: "EU", streak: 3 },
  { name: "StackSamurai", elo: 1780, region: "APAC", streak: 4 },
  { name: "BugHunter", elo: 1725, region: "NA", streak: 2 },
  { name: "LambdaLord", elo: 1690, region: "LATAM", streak: 5 },
  { name: "BitBard", elo: 1655, region: "EU", streak: 1 },
  { name: "PointerPirate", elo: 1630, region: "APAC", streak: 2 },
];

export default function Leaderboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 pt-24 pb-16 space-y-8">
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Leaderboard
          </span>
          <h1 className="text-4xl font-black text-foreground sm:text-5xl">Top duelers right now</h1>
          <p className="text-lg text-muted-foreground">
            Snapshot of the ladder with dummy data. Filter by region and streak to explore how the table will look with real rankings.
          </p>
        </header>

        <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 sm:flex sm:items-center sm:justify-between">
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>Season beta • Elo-based ladder • K-factor tuned for best-of-1 duels</div>
            <div>Streaks add visibility, not bonus Elo. Losses reset streak to zero.</div>
          </div>
          <div className="mt-3 flex gap-2 text-xs sm:mt-0">
            <span className="rounded-full bg-primary/10 px-3 py-1 font-semibold text-primary">Global</span>
            <span className="rounded-full bg-muted px-3 py-1 font-semibold text-foreground">Friends</span>
            <span className="rounded-full bg-muted px-3 py-1 font-semibold text-foreground">Guild</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/70">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-left">Region</th>
                <th className="px-4 py-3 text-left">Elo</th>
                <th className="px-4 py-3 text-left">Streak</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, idx) => (
                <tr key={p.name} className="border-t border-border/60 hover:bg-muted/40">
                  <td className="px-4 py-3 font-mono text-muted-foreground">{idx + 1}</td>
                  <td className="px-4 py-3 font-semibold text-foreground">{p.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.region}</td>
                  <td className="px-4 py-3 font-mono text-primary">{p.elo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.streak} win</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
