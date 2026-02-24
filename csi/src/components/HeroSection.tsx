import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MatchmakingQueue } from "./MatchmakingQueue";
import { Swords, Zap, Trophy, Users } from "lucide-react";

interface HeroSectionProps {
  onStartDuel?: () => void;
}

export function HeroSection({ onStartDuel }: HeroSectionProps) {
  const [isSearching, setIsSearching] = useState(false);

  const handleFindMatch = () => {
    setIsSearching(true);
  };

  const handleMatchFound = () => {
    setIsSearching(false);
    onStartDuel?.();
  };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 arena-grid opacity-30" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent" />

      {/* Floating orbs */}
      <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-float" />
      <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-secondary/10 blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 container px-4 text-center">
        {isSearching ? (
          <MatchmakingQueue
            isSearching={isSearching}
            onCancel={() => setIsSearching(false)}
            onMatchFound={handleMatchFound}
            className="mx-auto max-w-md animate-scale-in"
          />
        ) : (
          <div className="animate-fade-in">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-4 w-4" />
              <span>Real-time 1v1 Coding Battles</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              <span className="text-foreground">Code.</span>{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Compete.
              </span>{" "}
              <span className="text-foreground">Conquer.</span>
            </h1>

            {/* Subheading */}
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Enter the arena where developers face off in real-time coding duels.
              Solve problems faster, outsmart your opponent, and climb the ranks.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="cyber" size="xl" onClick={handleFindMatch}>
                <Swords className="mr-2 h-5 w-5" />
                Find Match
              </Button>
              <Button variant="cyber-outline" size="lg">
                <Trophy className="mr-2 h-5 w-5" />
                Leaderboard
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center sm:gap-16">
              <Stat icon={<Users className="h-5 w-5" />} value="12,847" label="Active Duelers" />
              <Stat icon={<Swords className="h-5 w-5" />} value="89,234" label="Duels Today" />
              <Stat icon={<Trophy className="h-5 w-5" />} value="156" label="Online Now" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-2xl font-bold text-foreground sm:text-3xl">{value}</span>
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
