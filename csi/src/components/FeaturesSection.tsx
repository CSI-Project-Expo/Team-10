import { Zap, Shield, Globe, Code, Timer, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Real-time Battles",
    description: "Face off against opponents in live coding duels with instant feedback and real-time progress tracking.",
    color: "primary",
  },
  {
    icon: <Timer className="h-6 w-6" />,
    title: "Timed Challenges",
    description: "Race against the clock. Every second counts in the heat of competitive coding.",
    color: "accent",
  },
  {
    icon: <Trophy className="h-6 w-6" />,
    title: "Skill-based Matching",
    description: "Our ELO-like rating system ensures you're always matched with opponents at your skill level.",
    color: "secondary",
  },
  {
    icon: <Code className="h-6 w-6" />,
    title: "Multiple Languages",
    description: "Code in JavaScript, Python, Java, C++, and more. Choose your weapon of choice.",
    color: "success",
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Global Rankings",
    description: "Climb the global leaderboard and earn your place among the world's best coders.",
    color: "primary",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Anti-cheat System",
    description: "Fair play guaranteed with our advanced plagiarism detection and anti-cheat measures.",
    color: "destructive",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />

      <div className="container relative px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for <span className="text-primary">Competitive</span> Coders
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every feature is designed to make coding duels intense, fair, and fun.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              color={feature.color}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  delay: number;
}) {
  const colorClasses: Record<string, string> = {
    primary: "text-primary bg-primary/10 group-hover:bg-primary/20",
    secondary: "text-secondary bg-secondary/10 group-hover:bg-secondary/20",
    accent: "text-accent bg-accent/10 group-hover:bg-accent/20",
    success: "text-success bg-success/10 group-hover:bg-success/20",
    destructive: "text-destructive bg-destructive/10 group-hover:bg-destructive/20",
  };

  return (
    <div
      className="glass-card group p-6 transition-all duration-300 hover-lift hover:border-primary/30"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div
        className={cn(
          "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300",
          colorClasses[color]
        )}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
