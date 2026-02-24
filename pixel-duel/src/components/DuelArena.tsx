import { useState } from "react";
import { cn } from "@/lib/utils";
import { PlayerCard } from "./PlayerCard";
import { CountdownTimer } from "./CountdownTimer";
import { Button } from "@/components/ui/button";
import { Play, RotateCcw, CheckCircle, XCircle, Swords } from "lucide-react";
import { useJudge } from "@/hooks/useJudge";
import { useMatchmaking } from "@/hooks/useMatchmaking";
import axios from "axios";
import { useMemo } from "react";

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
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const languageTemplates: Record<string, string> = {
    javascript: `const fs = require('fs');\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (map.has(need)) return [map.get(need), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}\nconst data = fs.readFileSync(0, 'utf8').trim().split(/\\s+/).filter(Boolean);\nif (data.length) {\n  const nums = data.map(Number);\n  const target = nums.pop();\n  const res = twoSum(nums, target);\n  console.log(res.length ? ('[' + res[0] + ',' + res[1] + ']') : '[]');\n}`,
    python: `import sys\n\ndef two_sum(nums, target):\n    lookup = {}\n    for i, n in enumerate(nums):\n        if target - n in lookup:\n            return [lookup[target - n], i]\n        lookup[n] = i\n    return []\n\nif __name__ == "__main__":\n    data = sys.stdin.read().strip().split()\n    if data:\n        nums = list(map(int, data))\n        target = nums.pop()\n        res = two_sum(nums, target)\n        if res:\n            print(f"[{res[0]},{res[1]}]")\n        else:\n            print("[]")\n`,
    java: `import java.util.*;\npublic class Main {\n    static int[] twoSum(int[] nums, int target) {\n        Map<Integer,Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int need = target - nums[i];\n            if (map.containsKey(need)) return new int[]{map.get(need), i};\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        List<Integer> list = new ArrayList<>();\n        while (sc.hasNextInt()) list.add(sc.nextInt());\n        if (list.size() < 2) return;\n        int target = list.remove(list.size() - 1);\n        int[] nums = list.stream().mapToInt(i -> i).toArray();\n        int[] res = twoSum(nums, target);\n        if (res.length == 2) System.out.println("[" + res[0] + "," + res[1] + "]");\n        else System.out.println("[]");\n    }\n}`,
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int,int> mp;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        int need = target - nums[i];\n        if (mp.count(need)) return {mp[need], i};\n        mp[nums[i]] = i;\n    }\n    return {};\n}\nint main() {\n    vector<int> nums;\n    int x;\n    while (cin >> x) nums.push_back(x);\n    if (nums.size() < 2) return 0;\n    int target = nums.back(); nums.pop_back();\n    auto ans = twoSum(nums, target);\n    cout << "[";\n    for (size_t i = 0; i < ans.size(); i++) { if (i) cout << ","; cout << ans[i]; }\n    cout << "]";\n    return 0;\n}`,
  };

  const [language, setLanguage] = useState<string>("javascript");
  const [code, setCode] = useState<string>(languageTemplates.javascript);
  const [analytics, setAnalytics] = useState<
    | {
        accuracy: number;
        durationMs: number;
        eloGained: number;
        newRating?: number;
        allPass: boolean;
      }
    | null
  >(null);
  const userId = "699e0e8b9ab2e91bcd967dd2"; // seeded demo user for local testing
  const elo = 1200;
  const { roomId, opponent, status } = useMatchmaking(userId, elo);
  const { judgeCode, results, loading } = useJudge();
  const backendBase = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

  const leaderboard = useMemo(
    () =>
      [
        { name: "CodePhoenix", elo: 1890 },
        { name: "AlgoKnight", elo: 1835 },
        { name: "StackSamurai", elo: 1780 },
        { name: "BugHunter", elo: 1725 },
        { name: "LambdaLord", elo: 1690 },
      ],
    []
  );

  const testCasesData = [
    { id: 1, input: "2 7 11 15\n9", expectedOutput: "[0,1]" },
    { id: 2, input: "3 2 4\n6", expectedOutput: "[1,2]" },
    { id: 3, input: "3 3\n6", expectedOutput: "[0,1]" },
    { id: 4, input: "1 2 3 4 5\n9", expectedOutput: "[3,4]" },
    { id: 5, input: "5 75 25\n100", expectedOutput: "[1,2]" },
  ];

  const runTests = async () => {
    setIsRunning(true);
    setTestCases((prev) => prev.map((tc) => ({ ...tc, passed: null })));
    const start = performance.now();
    const res = await judgeCode(code, language, testCasesData);
    const durationMs = performance.now() - start;
    if (res) {
      setTestCases((prev) => prev.map((tc, i) => ({ ...tc, passed: res[i]?.pass ?? null })));
      const passedCount = res.filter((r) => r.pass).length;
      setAnalytics({
        accuracy: testCasesData.length ? passedCount / testCasesData.length : 0,
        durationMs,
        eloGained: 0,
        allPass: res.every((r) => r.pass),
      });
    }
    setIsRunning(false);
    return res;
  };

  const handleSubmit = async () => {
    setHasSubmitted(true);
    const res = await runTests();
    const allPass = res?.every((r) => r.pass);
    if (allPass) {
      try {
        const submitRes = await axios.post(`${backendBase}/api/judge/submit`, {
          code,
          language,
          testCases: testCasesData,
          userId,
        });
        const { ratingDelta = 0, newRating, allPass: submitPass } = submitRes.data || {};
        const durationMs = analytics?.durationMs ?? 0;
        setAnalytics({
          accuracy: 1,
          durationMs,
          eloGained: submitPass ? ratingDelta : 0,
          newRating,
          allPass: !!submitPass,
        });
      } catch (err) {
        console.error("Submit failed", err);
      }
    } else {
      const durationMs = analytics?.durationMs ?? 0;
      const passedCount = res ? res.filter((r) => r.pass).length : 0;
      setAnalytics({
        accuracy: testCasesData.length ? passedCount / testCasesData.length : 0,
        durationMs,
        eloGained: 0,
        allPass: false,
      });
    }
  };

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[1fr_2fr_1fr]", className)}>
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

      <div className="space-y-4">
        <div className="flex justify-center">
          <CountdownTimer initialSeconds={900} />
        </div>

        <div className="flex justify-center">
          <div className="glass-card inline-flex items-center gap-2 px-4 py-2">
            <Swords className="h-5 w-5 text-primary" />
            <span className="font-bold text-foreground">LIVE DUEL</span>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                two-sum.js
              </span>
              <div className="flex gap-1">
                {["javascript", "python", "java", "cpp"].map((lang) => (
                  <button
                    key={lang}
                    className={cn(
                      "rounded px-2 py-1 text-xs transition-colors",
                      lang === language
                        ? "bg-primary/20 text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    onClick={() => {
                      setLanguage(lang);
                      setCode(languageTemplates[lang]);
                    }}
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
              <Button variant="cyber" size="sm" onClick={handleSubmit} disabled={isRunning}>
                Submit
              </Button>
            </div>
          </div>

          <div className="h-80 bg-background/50 p-2 font-mono text-sm">
            <textarea
              className="h-full w-full resize-none bg-transparent outline-none"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>

        {analytics && (
          <div className="glass-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-muted-foreground">Submission Stats</h4>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-semibold",
                  analytics.allPass ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                )}
              >
                {analytics.allPass ? "All Pass" : "Failed"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-muted-foreground">Accuracy</div>
                <div className="font-mono text-lg">{Math.round(analytics.accuracy * 100)}%</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">Elo gained</div>
                <div className="font-mono text-lg text-success">+{analytics.eloGained || 0}</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">Duration</div>
                <div className="font-mono text-lg">{analytics.durationMs.toFixed(0)} ms</div>
              </div>
              {analytics.newRating && (
                <div className="space-y-1">
                  <div className="text-muted-foreground">New rating</div>
                  <div className="font-mono text-lg">{analytics.newRating}</div>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Execution time</span>
                <span>{analytics.durationMs.toFixed(0)} ms</span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                  style={{ width: `${Math.min(100, (analytics.durationMs / 5000) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>0 ms</span>
                <span>5,000 ms</span>
              </div>
            </div>
          </div>
        )}
      </div>

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

        {/* Leaderboard */}
        <div className="glass-card p-4">
          <h4 className="mb-3 text-sm font-semibold text-muted-foreground">Leaderboard</h4>
          <div className="space-y-2 text-sm">
            {leaderboard.map((p, idx) => (
              <div key={p.name} className="flex items-center justify-between">
                <span className="font-medium text-foreground">{idx + 1}. {p.name}</span>
                <span className="font-mono text-primary">{p.elo}</span>
              </div>
            ))}
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
