import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  initialSeconds: number;
  onComplete?: () => void;
  isPreBattle?: boolean;
  className?: string;
}

export function CountdownTimer({
  initialSeconds,
  onComplete,
  isPreBattle = false,
  className,
}: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete?.();
      return;
    }

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onComplete]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getUrgencyClass = () => {
    if (seconds <= 10) return "text-destructive";
    if (seconds <= 30) return "text-accent";
    return "text-foreground";
  };

  if (isPreBattle) {
    const displayText = seconds === 0 ? "CODE!" : seconds.toString();
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div
          key={seconds}
          className={cn(
            "countdown-number",
            isAnimating && "animate-countdown-pop",
            seconds === 0 && "text-glow-primary"
          )}
        >
          {displayText}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "glass-card inline-flex items-center justify-center px-6 py-3",
        seconds <= 10 && "animate-glow-pulse border-destructive/50",
        className
      )}
    >
      <span
        className={cn(
          "font-mono text-3xl font-bold transition-colors duration-300",
          getUrgencyClass(),
          isAnimating && "scale-110"
        )}
        style={{ transition: "transform 0.1s ease-out" }}
      >
        {formatTime(seconds)}
      </span>
    </div>
  );
}
