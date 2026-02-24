import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { DuelArena } from "@/components/DuelArena";
import { PreBattleCountdown } from "@/components/PreBattleCountdown";

type AppState = "landing" | "countdown" | "arena";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("landing");

  const handleStartDuel = () => {
    setAppState("countdown");
  };

  const handleCountdownComplete = () => {
    setAppState("arena");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {appState === "landing" && (
        <>
          <main className="pt-16">
            <HeroSection onStartDuel={handleStartDuel} />
            <FeaturesSection />

            {/* Footer */}
            <footer className="border-t border-border py-8">
              <div className="container px-4">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                  <p className="text-sm text-muted-foreground">
                    © 2024 CodeDuel. All rights reserved.
                  </p>
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-foreground transition-colors">Terms</a>
                    <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
                    <a href="#" className="hover:text-foreground transition-colors">Contact</a>
                  </div>
                </div>
              </div>
            </footer>
          </main>
        </>
      )}

      {appState === "countdown" && (
        <PreBattleCountdown onComplete={handleCountdownComplete} />
      )}

      {appState === "arena" && (
        <main className="min-h-screen pt-20 pb-8">
          <div className="container px-4">
            {/* Problem statement */}
            <div className="glass-card mb-6 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-success/20 px-3 py-1 text-xs font-semibold text-success">
                      Easy
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Problem #42
                    </span>
                  </div>
                  <h1 className="mt-2 text-2xl font-bold text-foreground">
                    Two Sum
                  </h1>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    Given an array of integers <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">nums</code> and 
                    an integer <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">target</code>, 
                    return indices of the two numbers such that they add up to <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground">target</code>.
                  </p>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    You may assume that each input would have exactly one solution, and you may not use the same element twice.
                  </p>
                </div>
              </div>

              {/* Example */}
              <div className="mt-4 rounded-lg bg-muted/50 p-4 font-mono text-sm">
                <div className="text-muted-foreground">
                  <span className="text-foreground font-semibold">Example:</span>
                </div>
                <div className="mt-2">
                  <span className="text-muted-foreground">Input:</span>{" "}
                  <span className="text-primary">nums = [2,7,11,15], target = 9</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Output:</span>{" "}
                  <span className="text-success">[0,1]</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Explanation: nums[0] + nums[1] = 2 + 7 = 9
                </div>
              </div>
            </div>

            {/* Arena */}
            <DuelArena />
          </div>
        </main>
      )}
    </div>
  );
};

export default Index;
