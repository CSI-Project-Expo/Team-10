import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Swords, X, Loader2 } from "lucide-react";

interface MatchmakingQueueProps {
  isSearching: boolean;
  onCancel: () => void;
  onMatchFound?: () => void;
  estimatedTime?: number;
  className?: string;
}

export function MatchmakingQueue({
  isSearching,
  onCancel,
  onMatchFound,
  estimatedTime = 30,
  className,
}: MatchmakingQueueProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [matchFound, setMatchFound] = useState(false);

  useEffect(() => {
    if (!isSearching) {
      setElapsedTime(0);
      setMatchFound(false);
      return;
    }

    const interval = setInterval(() => {
      setElapsedTime((t) => t + 1);
    }, 1000);

    // Simulate match found after random time (demo only)
    const matchTimeout = setTimeout(() => {
      setMatchFound(true);
      setTimeout(() => {
        onMatchFound?.();
      }, 1500);
    }, Math.random() * 3000 + 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(matchTimeout);
    };
  }, [isSearching, onMatchFound]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isSearching) return null;

  return (
    <div
      className={cn(
        "glass-card relative overflow-hidden p-8 text-center",
        matchFound && "border-primary/50",
        className
      )}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 animate-gradient-shift" />

      {/* Scanning line effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 animate-[scan-line_2s_linear_infinite]" />
      </div>

      <div className="relative">
        {matchFound ? (
          <>
            <div className="mb-4 flex justify-center">
              <div className="relative">
                <Swords className="h-16 w-16 text-primary animate-pulse-glow" />
                <div className="absolute inset-0 animate-ping">
                  <Swords className="h-16 w-16 text-primary opacity-30" />
                </div>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-glow-primary text-primary">
              OPPONENT FOUND!
            </h3>
            <p className="mt-2 text-muted-foreground">Preparing the arena...</p>
          </>
        ) : (
          <>
            {/* Pulsing rings */}
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-24 w-24 rounded-full border-2 border-primary/30 animate-pulse-ring" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full border-2 border-primary/50 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 border border-primary/50">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-foreground">
              Searching for opponent...
            </h3>

            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>Time: {formatTime(elapsedTime)}</span>
              <span className="text-border">•</span>
              <span>Est. wait: ~{estimatedTime}s</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="mt-6"
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
