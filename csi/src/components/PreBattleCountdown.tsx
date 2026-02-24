import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PreBattleCountdownProps {
  onComplete: () => void;
  className?: string;
}

export function PreBattleCountdown({ onComplete, className }: PreBattleCountdownProps) {
  const [count, setCount] = useState(3);
  const [phase, setPhase] = useState<"countdown" | "code">("countdown");

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === "countdown") {
      setPhase("code");
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [count, phase, onComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm",
        className
      )}
    >
      {/* Animated background rings */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute h-[600px] w-[600px] rounded-full border border-primary/20 animate-pulse-ring" />
        <div className="absolute h-[500px] w-[500px] rounded-full border border-primary/30 animate-pulse-ring" style={{ animationDelay: "0.2s" }} />
        <div className="absolute h-[400px] w-[400px] rounded-full border border-primary/40 animate-pulse-ring" style={{ animationDelay: "0.4s" }} />
      </div>

      <div key={phase === "code" ? "code" : count} className="relative animate-countdown-pop">
        {phase === "code" ? (
          <div className="text-center">
            <div className="countdown-number">CODE!</div>
            <p className="mt-4 text-xl text-muted-foreground animate-fade-in">
              May the best coder win
            </p>
          </div>
        ) : (
          <div className="countdown-number">{count}</div>
        )}
      </div>
    </div>
  );
}
