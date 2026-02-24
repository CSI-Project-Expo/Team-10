import { useEffect, useState, useCallback } from "react";
import { getSocket } from "@/lib/socket";

type MatchStatus = "idle" | "searching" | "matched";

export function useMatchmaking(userId: string, elo: number, options?: { autoStart?: boolean }) {
  const autoStart = options?.autoStart ?? true;
  const [roomId, setRoomId] = useState<string | null>(null);
  const [opponent, setOpponent] = useState<string | null>(null);
  const [status, setStatus] = useState<MatchStatus>("idle");
  const [active, setActive] = useState(autoStart);

  const socket = getSocket();

  const startMatchmaking = useCallback(() => {
    if (!userId) return;
    setActive(true);
    setStatus("searching");
    socket.emit("register_user", { userId });
    socket.emit("find_match", { userId, elo });
  }, [elo, socket, userId]);

  const stopMatchmaking = useCallback(() => {
    setActive(false);
    setStatus("idle");
    socket.emit("cancel_match");
  }, [socket]);

  useEffect(() => {
    if (!userId) return;
    const handleMatchFound = ({ roomId, opponent }: { roomId: string; opponent: string }) => {
      setRoomId(roomId);
      setOpponent(opponent);
      setStatus("matched");
      setActive(false);
    };
    socket.on("match_found", handleMatchFound);
    return () => {
      socket.off("match_found", handleMatchFound);
    };
  }, [socket, userId]);

  useEffect(() => {
    if (autoStart && userId) {
      startMatchmaking();
    }
    return () => {
      socket.emit("cancel_match");
    };
  }, [autoStart, startMatchmaking, socket, userId]);

  useEffect(() => {
    if (!active) return;
    if (!userId) return;
    setStatus("searching");
    socket.emit("register_user", { userId });
    socket.emit("find_match", { userId, elo });
  }, [active, elo, socket, userId]);

  return { roomId, opponent, status, startMatchmaking, stopMatchmaking };
}
