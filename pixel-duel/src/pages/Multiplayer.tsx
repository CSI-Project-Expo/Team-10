import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import { DuelArena } from "@/components/DuelArena";
import { Swords, Wifi, Loader2 } from "lucide-react";

export default function Multiplayer() {
  const userId = "699e0e8b9ab2e91bcd967dd2"; // seeded demo user
  const elo = 1200;
  const { roomId, opponent, status, startMatchmaking, stopMatchmaking } = useMatchmaking(userId, elo, {
    autoStart: false,
  });
  const [showArena, setShowArena] = useState(false);

  useEffect(() => {
    if (status === "matched") {
      setShowArena(true);
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 pt-24 pb-16 space-y-10">
        <header className="space-y-3">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            Multiplayer
          </span>
          <h1 className="text-4xl font-black text-foreground sm:text-5xl">Find a live opponent and duel</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Start matchmaking to pair with another user. When matched, we’ll drop you into the arena with the shared timer stopped on submit.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Wifi className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Matchmaking</div>
                <div className="text-xs text-muted-foreground">Status: {status}</div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>We register your socket, enqueue you by Elo, and emit <code>match_found</code> when paired.</p>
              <p className="text-xs">Room: {roomId || "—"} • Opponent: {opponent || "Waiting"}</p>
            </div>

            <div className="flex gap-3">
              <Button variant="cyber" size="lg" onClick={startMatchmaking} disabled={status === "searching"}>
                {status === "searching" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Swords className="mr-2 h-4 w-4" />}
                {status === "searching" ? "Searching..." : "Start matchmaking"}
              </Button>
              <Button variant="outline" size="lg" onClick={stopMatchmaking} disabled={status !== "searching"}>
                Cancel
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-muted/30 p-6">
            <h3 className="text-lg font-semibold text-foreground">How it works</h3>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Click “Start matchmaking” on two browser windows (use an incognito tab for the second).</li>
              <li>Both tabs register sockets, enqueue with Elo, and receive <code>match_found</code>.</li>
              <li>Once matched, the Duel Arena renders and you can submit to lock Elo changes.</li>
            </ol>
            <p className="mt-3 text-xs text-muted-foreground">This flow is wired end-to-end with the updated socket + queue logic.</p>
          </div>
        </div>

        {showArena && (
          <div className="mt-4">
            <DuelArena />
          </div>
        )}
      </main>
    </div>
  );
}
