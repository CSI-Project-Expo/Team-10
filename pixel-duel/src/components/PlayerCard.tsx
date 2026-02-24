import { cn } from "@/lib/utils";
import { Trophy, Code, Flame, ChevronUp, ChevronDown } from "lucide-react";

interface PlayerCardProps {
  username: string;
  rating: number;
  ratingChange?: number;
  avatar?: string;
  isOnline?: boolean;
  isCoding?: boolean;
  winStreak?: number;
  rank?: number;
  isOpponent?: boolean;
  className?: string;
}

export function PlayerCard({
  username,
  rating,
  ratingChange,
  avatar,
  isOnline = false,
  isCoding = false,
  winStreak = 0,
  rank,
  isOpponent = false,
  className,
}: PlayerCardProps) {
  const getRankBadge = (rank: number) => {
    if (rank <= 10) return { label: "Grandmaster", color: "text-accent" };
    if (rank <= 50) return { label: "Master", color: "text-secondary" };
    if (rank <= 200) return { label: "Expert", color: "text-primary" };
    if (rank <= 500) return { label: "Specialist", color: "text-success" };
    return { label: "Coder", color: "text-muted-foreground" };
  };

  const rankInfo = rank ? getRankBadge(rank) : null;

  return (
    <div
      className={cn(
        "glass-card group relative p-4 transition-all duration-300 hover-lift",
        isOpponent && "border-destructive/30",
        className
      )}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-secondary/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-center gap-4">
        {/* Avatar */}
        <div className={cn("relative", isOnline && "status-online", isCoding && "status-coding")}>
          <div className="h-14 w-14 overflow-hidden rounded-xl border-2 border-border bg-muted">
            {avatar ? (
              <img src={avatar} alt={username} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 text-xl font-bold text-primary">
                {username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">{username}</span>
            {winStreak >= 3 && (
              <div className="flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5">
                <Flame className="h-3 w-3 text-accent" />
                <span className="text-xs font-semibold text-accent">{winStreak}</span>
              </div>
            )}
          </div>

          <div className="mt-1 flex items-center gap-3">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-accent" />
              <span className="font-mono text-sm font-semibold text-foreground">{rating}</span>
              {ratingChange !== undefined && ratingChange !== 0 && (
                <span
                  className={cn(
                    "flex items-center text-xs font-semibold",
                    ratingChange > 0 ? "text-success" : "text-destructive"
                  )}
                >
                  {ratingChange > 0 ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                  {Math.abs(ratingChange)}
                </span>
              )}
            </div>

            {/* Rank */}
            {rankInfo && (
              <span className={cn("text-xs font-medium", rankInfo.color)}>
                {rankInfo.label}
              </span>
            )}
          </div>
        </div>

        {/* Status indicator */}
        {isCoding && (
          <div className="flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1.5">
            <Code className="h-4 w-4 text-accent" />
            <div className="flex gap-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-typing-1" />
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-typing-2" />
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-typing-3" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
