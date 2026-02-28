import { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { ArrowUp, ArrowDown, Minus, Zap } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Player {
  id: string;
  name: string;
  elo: number;
  prevElo: number;
  region: string;
  streak: number;
  /** rank delta since last tick: negative = climbed, positive = dropped */
  rankDelta: number;
  /** last tick this player was touched – used for flash highlight */
  lastUpdated: number;
  avatar: string;
}

/* ------------------------------------------------------------------ */
/*  Seed data                                                          */
/* ------------------------------------------------------------------ */
const AVATARS = ["🐉", "⚔️", "🧙", "🐛", "λ", "🎭", "☠️", "🤖", "🦊", "🔮", "👾", "🎯", "💎", "🏹", "🛡️"];

const SEED: Omit<Player, "prevElo" | "rankDelta" | "lastUpdated" | "id" | "avatar">[] = [
  { name: "CodePhoenix", elo: 1890, region: "NA", streak: 6 },
  { name: "AlgoKnight", elo: 1835, region: "EU", streak: 3 },
  { name: "StackSamurai", elo: 1780, region: "APAC", streak: 4 },
  { name: "BugHunter", elo: 1725, region: "NA", streak: 2 },
  { name: "LambdaLord", elo: 1690, region: "LATAM", streak: 5 },
  { name: "BitBard", elo: 1655, region: "EU", streak: 1 },
  { name: "PointerPirate", elo: 1630, region: "APAC", streak: 2 },
  { name: "RecursionRex", elo: 1610, region: "NA", streak: 0 },
  { name: "NullNinja", elo: 1585, region: "EU", streak: 3 },
  { name: "HeapHero", elo: 1560, region: "LATAM", streak: 1 },
  { name: "ByteBlitz", elo: 1540, region: "APAC", streak: 0 },
  { name: "GraphGuru", elo: 1515, region: "NA", streak: 2 },
];

function makePlayers(): Player[] {
  return SEED.map((s, i) => ({
    ...s,
    id: s.name,
    prevElo: s.elo,
    rankDelta: 0,
    lastUpdated: 0,
    avatar: AVATARS[i % AVATARS.length],
  }));
}

/* ------------------------------------------------------------------ */
/*  Random-update helpers                                              */
/* ------------------------------------------------------------------ */
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Simulate a duel result between two random players */
function simulateTick(players: Player[], tick: number): Player[] {
  const copy = players.map((p) => ({ ...p, prevElo: p.elo }));

  // Pick 1-3 random "duels" per tick
  const duels = rand(1, 3);
  const touched = new Set<number>();

  for (let d = 0; d < duels; d++) {
    let a = rand(0, copy.length - 1);
    let b = rand(0, copy.length - 1);
    while (b === a) b = rand(0, copy.length - 1);

    // expected scores
    const ea = 1 / (1 + 10 ** ((copy[b].elo - copy[a].elo) / 400));

    // coin flip who wins, weighted slightly towards higher elo
    const aWins = Math.random() < ea + 0.05;
    const K = 32;
    const delta = Math.round(K * (aWins ? 1 - ea : 0 - ea));

    copy[a].elo += delta;
    copy[b].elo -= delta;

    if (aWins) {
      copy[a].streak += 1;
      copy[b].streak = 0;
    } else {
      copy[b].streak += 1;
      copy[a].streak = 0;
    }

    copy[a].lastUpdated = tick;
    copy[b].lastUpdated = tick;
    touched.add(a);
    touched.add(b);
  }

  // Build old-rank map before sorting
  const oldRank = new Map<string, number>();
  copy.forEach((p, i) => oldRank.set(p.id, i));

  // Sort descending by elo
  copy.sort((a, b) => b.elo - a.elo);

  // Compute rank deltas
  copy.forEach((p, newIdx) => {
    const prev = oldRank.get(p.id) ?? newIdx;
    p.rankDelta = prev - newIdx; // positive = climbed
  });

  return copy;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>(makePlayers);
  const [isPaused, setIsPaused] = useState(false);
  const [tab, setTab] = useState<"global" | "friends" | "guild">("global");
  const tickRef = useRef(0);

  const tick = useCallback(() => {
    tickRef.current += 1;
    setPlayers((prev) => simulateTick(prev, tickRef.current));
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(tick, 3000);
    return () => clearInterval(id);
  }, [isPaused, tick]);

  /* flash highlight fades after 3 s */
  const isRecent = (p: Player) => tickRef.current - p.lastUpdated < 1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 pt-24 pb-16 space-y-8">
        {/* ---- Header ---- */}
        <header className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            LIVE
          </span>
          <h1 className="text-4xl font-black text-foreground sm:text-5xl">
            Top duelers right now
          </h1>
          <p className="text-lg text-muted-foreground">
            Rankings update in real-time as duels resolve. Watch the ladder shift every few seconds.
          </p>
        </header>

        {/* ---- Info bar ---- */}
        <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 sm:flex sm:items-center sm:justify-between">
          <div className="space-y-1 text-sm text-muted-foreground">
            <div>Season beta · Elo-based ladder · K-factor tuned for best-of-1 duels</div>
            <div>Streaks add visibility, not bonus Elo. Losses reset streak to zero.</div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs sm:mt-0">
            {(["global", "friends", "guild"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-full px-3 py-1 font-semibold capitalize transition-colors ${
                  tab === t
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-foreground hover:bg-muted/70"
                }`}
              >
                {t}
              </button>
            ))}
            <span className="mx-1 h-4 w-px bg-border" />
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="rounded-full bg-muted px-3 py-1 font-semibold text-foreground hover:bg-muted/70 transition-colors"
            >
              {isPaused ? "▶ Resume" : "⏸ Pause"}
            </button>
          </div>
        </div>

        {/* ---- Table ---- */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/70">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left w-12">#</th>
                <th className="px-4 py-3 text-left">Player</th>
                <th className="px-4 py-3 text-left">Region</th>
                <th className="px-4 py-3 text-left">Elo</th>
                <th className="px-4 py-3 text-left">Change</th>
                <th className="px-4 py-3 text-left">Streak</th>
                <th className="px-4 py-3 text-left w-16">Rank</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, idx) => {
                const eloDiff = p.elo - p.prevElo;
                const recent = isRecent(p);
                return (
                  <tr
                    key={p.id}
                    className={`border-t border-border/60 transition-all duration-500 ${
                      recent
                        ? "bg-primary/5"
                        : "hover:bg-muted/40"
                    } ${idx === 0 ? "bg-yellow-500/5" : ""}`}
                  >
                    {/* Rank */}
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {idx === 0 ? "👑" : idx + 1}
                    </td>

                    {/* Player */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{p.avatar}</span>
                        <span className="font-semibold text-foreground">{p.name}</span>
                        {p.streak >= 5 && (
                          <span className="inline-flex items-center gap-0.5 text-orange-400" title="On fire!">
                            <Zap className="h-3.5 w-3.5 fill-orange-400" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Region */}
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {p.region}
                      </span>
                    </td>

                    {/* Elo */}
                    <td className="px-4 py-3 font-mono font-bold text-primary tabular-nums">
                      {p.elo}
                    </td>

                    {/* Elo change */}
                    <td className="px-4 py-3 font-mono text-xs tabular-nums">
                      {eloDiff !== 0 && recent ? (
                        <span
                          className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 font-semibold ${
                            eloDiff > 0
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {eloDiff > 0 ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )}
                          {eloDiff > 0 ? `+${eloDiff}` : eloDiff}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </td>

                    {/* Streak */}
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">
                      {p.streak > 0 ? (
                        <span className={p.streak >= 5 ? "text-orange-400 font-semibold" : ""}>
                          🔥 {p.streak}W
                        </span>
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>

                    {/* Rank movement */}
                    <td className="px-4 py-3 font-mono text-xs tabular-nums">
                      {p.rankDelta > 0 && recent ? (
                        <span className="inline-flex items-center gap-0.5 text-green-500 font-semibold">
                          <ArrowUp className="h-3 w-3" />
                          {p.rankDelta}
                        </span>
                      ) : p.rankDelta < 0 && recent ? (
                        <span className="inline-flex items-center gap-0.5 text-red-400 font-semibold">
                          <ArrowDown className="h-3 w-3" />
                          {Math.abs(p.rankDelta)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/40">
                          <Minus className="h-3 w-3" />
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ---- Footer note ---- */}
        <p className="text-center text-xs text-muted-foreground/60">
          Demo mode — simulated duels resolve every 3 seconds. Rankings and Elo deltas are generated client-side.
        </p>
      </main>
    </div>
  );
}
