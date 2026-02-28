import { useEffect, useState, useCallback, useRef } from "react";
import { getSocket } from "@/lib/socket";

type MatchStatus = "idle" | "searching" | "matched" | "error";

interface MatchFoundPayload {
  roomId: string;
  opponent: string;
}

interface UseMatchmakingOptions {
  autoStart?: boolean;
}

interface UseMatchmakingReturn {
  roomId: string | null;
  opponent: string | null;
  status: MatchStatus;
  error: string | null;
  startMatchmaking: () => void;
  stopMatchmaking: () => void;
}

/**
 * Hook for managing matchmaking queue and match discovery
 */
export function useMatchmaking(
  userId: string,
  elo: number,
  options?: UseMatchmakingOptions
): UseMatchmakingReturn {
  const autoStart = options?.autoStart ?? true;

  const [roomId, setRoomId] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<string | null>(null);
  const [status, setStatus] = useState<MatchStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  // Track if we've already started to prevent duplicate emissions
  const hasStartedRef = useRef(false);
  const socket = getSocket();

  const startMatchmaking = useCallback(() => {
    if (!userId || hasStartedRef.current) return;

    hasStartedRef.current = true;
    setStatus("searching");
    setError(null);
    setRoomId(null);
    setOpponent(null);

    // Register user and start searching
    socket.emit("register_user", { userId });
    socket.emit("find_match", { userId, elo });
  }, [elo, socket, userId]);

  const stopMatchmaking = useCallback(() => {
    hasStartedRef.current = false;
    setStatus("idle");
    socket.emit("cancel_match");
  }, [socket]);

  // Handle match found event
  useEffect(() => {
    if (!userId) return;

    const handleMatchFound = ({ roomId, opponent }: MatchFoundPayload) => {
      setRoomId(roomId);
      setOpponent(opponent);
      setStatus("matched");
      hasStartedRef.current = false;
    };

    const handleMatchError = (errorMsg: string) => {
      setError(errorMsg);
      setStatus("error");
      hasStartedRef.current = false;
    };

    socket.on("match_found", handleMatchFound);
    socket.on("match_error", handleMatchError);

    return () => {
      socket.off("match_found", handleMatchFound);
      socket.off("match_error", handleMatchError);
    };
  }, [socket, userId]);

  // Auto-start effect (runs once)
  useEffect(() => {
    if (autoStart && userId && !hasStartedRef.current) {
      startMatchmaking();
    }

    // Cleanup on unmount
    return () => {
      if (hasStartedRef.current) {
        socket.emit("cancel_match");
        hasStartedRef.current = false;
      }
    };
  }, [autoStart, startMatchmaking, socket, userId]);

  return {
    roomId,
    opponent,
    status,
    error,
    startMatchmaking,
    stopMatchmaking,
  };
}
