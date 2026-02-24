import { useState } from "react";
import { cn } from "@/lib/utils";
import { PlayerCard } from "./PlayerCard";
import { CountdownTimer } from "./CountdownTimer";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, CheckCircle, XCircle, Swords } from "lucide-react";

interface TestCase {
  id: number;
  passed: boolean | null;
}

interface DuelArenaProps {
  className?: string;
}

export function DuelArena({ className }: DuelArenaProps) {
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: 1, passed: null },
    { id: 2, passed: null },
    { id: 3, passed: null },
    { id: 4, passed: null },
    { id: 5, passed: null },
  ]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = () => {
    setIsRunning(true);
    setTestCases((prev) => prev.map((tc) => ({ ...tc, passed: null })));

    // Simulate test execution
    testCases.forEach((_, index) => {
      setTimeout(() => {
        setTestCases((prev) =>
          prev.map((tc, i) =>
            i === index ? { ...tc, passed: Math.random() > 0.3 } : tc
          )
        );
        if (index === testCases.length - 1) {
          setIsRunning(false);
        }
      }, (index + 1) * 500);
    });
  };

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[1fr_2fr_1fr]", className)}>
      {/* Left side - You */}
      <div className="space-y-4">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            You
          </span>
        </div>
        <PlayerCard
          username="CodeNinja"
          rating={1842}
          rank={156}
          isOnline
          isCoding
          winStreak={5}
          className="border-primary/30"
        />

        {/* Test Cases */}
        <div className="glass-card p-4">
          <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
            Test Cases
          </h4>
          <div className="flex gap-2">
            {testCases.map((tc) => (
              <div
                key={tc.id}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-lg border transition-all duration-300",
                  tc.passed === null && "border-border bg-muted/50",
                  tc.passed === true &&
                    "border-success/50 bg-success/20 text-success",
                  tc.passed === false &&
                    "border-destructive/50 bg-destructive/20 text-destructive"
                )}
              >
                {tc.passed === null ? (
                  <span className="text-xs text-muted-foreground">{tc.id}</span>
                ) : tc.passed ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <XCircle className="h-5 w-5" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Center - Code Editor Area */}
      <div className="space-y-4">
        {/* Timer */}
        <div className="flex justify-center">
          <CountdownTimer initialSeconds={900} />
        </div>

        {/* VS Badge */}
        <div className="flex justify-center">
          <div className="glass-card inline-flex items-center gap-2 px-4 py-2">
            <Swords className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">LIVE DUEL</span>
          </div>
        </div>

        {/* Code Editor Placeholder */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                solution.js
              </span>
              <div className="flex gap-1">
                {["JavaScript", "Python", "Java", "C++"].map((lang) => (
                  <button
                    key={lang}
                    className={cn(
                      "rounded px-2 py-1 text-xs transition-colors",
                      lang === "JavaScript"
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="arena" size="sm" onClick={runTests} disabled={isRunning}>
                {isRunning ? (
                  <RotateCcw className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isRunning ? "Running..." : "Run"}
              </Button>
              <Button variant="cyber" size="sm">
                Submit
              </Button>
            </div>
          </div>

          {/* Mock code editor */}
          <div className="h-80 bg-background/50 p-4 font-mono text-sm">
            <div className="space-y-1 text-muted-foreground">
              <div>
                <span className="text-secondary">function</span>{" "}
                <span className="text-primary">twoSum</span>
                <span className="text-foreground">(nums, target) {"{"}</span>
              </div>
              <div className="pl-4">
                <span className="text-secondary">const</span>{" "}
                <span className="text-foreground">map</span>{" "}
                <span className="text-secondary">=</span>{" "}
                <span className="text-secondary">new</span>{" "}
                <span className="text-primary">Map</span>
                <span className="text-foreground">();</span>
              </div>
              <div className="pl-4">
                <span className="text-secondary">for</span>{" "}
                <span className="text-foreground">(</span>
                <span className="text-secondary">let</span>{" "}
                <span className="text-foreground">i = 0; i {"<"} nums.length; i++) {"{"}</span>
              </div>
              <div className="pl-8">
                <span className="text-secondary">const</span>{" "}
                <span className="text-foreground">complement</span>{" "}
                <span className="text-secondary">=</span>{" "}
                <span className="text-foreground">target - nums[i];</span>
              </div>
              <div className="pl-8">
                <span className="text-secondary">if</span>{" "}
                <span className="text-foreground">(map.has(complement)) {"{"}</span>
              </div>
              <div className="pl-12">
                <span className="text-secondary">return</span>{" "}
                <span className="text-foreground">[map.get(complement), i];</span>
              </div>
              <div className="pl-8">
                <span className="text-foreground">{"}"}</span>
              </div>
              <div className="pl-8">
                <span className="text-foreground">map.set(nums[i], i);</span>
              </div>
              <div className="pl-4">
                <span className="text-foreground">{"}"}</span>
              </div>
              <div>
                <span className="text-foreground">{"}"}</span>
              </div>
              <div className="h-4" />
              <div className="flex items-center">
                <span className="animate-pulse text-primary">|</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Opponent */}
      <div className="space-y-4">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-destructive">
            Opponent
          </span>
        </div>
        <PlayerCard
          username="AlgoMaster"
          rating={1895}
          rank={98}
          isOnline
          isCoding
          winStreak={3}
          isOpponent
        />

        {/* Opponent progress */}
        <div className="glass-card p-4">
          <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
            Opponent Progress
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Test cases passed</span>
              <span className="font-mono font-semibold text-foreground">3/5</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: "60%" }}
              />
            </div>
          </div>
        </div>

        {/* Live feed */}
        <div className="glass-card p-4">
          <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
            Live Feed
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-success">●</span>
              <span>Passed test case 3</span>
              <span className="ml-auto">2s ago</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-destructive">●</span>
              <span>Failed test case 4</span>
              <span className="ml-auto">15s ago</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-accent">●</span>
              <span>Submitted solution</span>
              <span className="ml-auto">20s ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
