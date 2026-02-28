import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";

const backendBase = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");
const JUDGE_URL = backendBase
  ? `${backendBase}/api/judge`
  : "http://localhost:5000/api/judge";

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface JudgeResult {
  output: string;
  expected: string;
  pass: boolean;
}

export interface UseJudgeReturn {
  judgeCode: (code: string, language: string, testCases: TestCase[]) => Promise<JudgeResult[] | null>;
  results: JudgeResult[] | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Hook for running code against test cases via the judge API
 */
export function useJudge(): UseJudgeReturn {
  const [results, setResults] = useState<JudgeResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const judgeCode = useCallback(
    async (code: string, language: string, testCases: TestCase[]): Promise<JudgeResult[] | null> => {
      // Validate inputs
      if (!code.trim()) {
        setError("Code cannot be empty");
        return null;
      }

      if (!testCases.length) {
        setError("At least one test case is required");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await axios.post<{ results: JudgeResult[] }>(
          JUDGE_URL,
          { code, language, testCases },
          { timeout: 30000 } // 30 second timeout for code execution
        );

        const judgeResults = res.data.results;
        setResults(judgeResults);
        return judgeResults;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        let errorMessage = "Judge request failed";

        if (axiosError.response) {
          // Server responded with error
          errorMessage = axiosError.response.data?.message || `Server error: ${axiosError.response.status}`;
        } else if (axiosError.code === "ECONNABORTED") {
          errorMessage = "Request timed out - code may be running too long";
        } else if (axiosError.code === "ERR_NETWORK") {
          errorMessage = "Network error - check if the server is running";
        }

        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  return { judgeCode, results, loading, error, clearError };
}
