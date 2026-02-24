import { useState } from "react";
import axios from "axios";

const backendBase = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");
const JUDGE_URL = backendBase
  ? `${backendBase}/api/judge`
  : "http://localhost:5000/api/judge";

type JudgeResult = { output: string; expected: string; pass: boolean };

export function useJudge() {
  const [results, setResults] = useState<JudgeResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function judgeCode(code: string, language: string, testCases: any[]) {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(JUDGE_URL, { code, language, testCases });
      setResults(res.data.results);
      return res.data.results as JudgeResult[];
    } catch (err: any) {
      setError(err.message || "Judge request failed");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { judgeCode, results, loading, error };
}
