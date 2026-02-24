import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="glass-card p-8 space-y-6 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-2">Welcome to CodeDuel!</h1>
        <p className="text-muted-foreground mb-4">Compete, code, and climb the leaderboard. Get started by signing in or creating an account.</p>
        <Button variant="arena" className="w-full mb-2" onClick={() => navigate("/signin")}>Sign In</Button>
        <Button variant="cyber" className="w-full" onClick={() => navigate("/signup")}>Create Account</Button>
      </div>
    </div>
  );
}
