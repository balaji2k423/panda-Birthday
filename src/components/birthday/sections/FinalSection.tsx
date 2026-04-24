import { useState } from "react";
import { motion } from "framer-motion";
import { FloatingParticles, Typewriter } from "../Atmosphere";
import { GlowButton } from "../GlowButton";

interface Props {
  onReplay: () => void;
  onBack: () => void;
}

export const FinalSection = ({ onReplay, onBack }: Props) => {
  const [done, setDone] = useState(false);

  return (
    <section className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-dawn px-6">
      <FloatingParticles count={30} colorClass="bg-secondary" />

      <div className="relative z-10 flex max-w-2xl flex-col items-center gap-10 text-center">
        {/* Glowing heart */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="animate-heart-pulse"
        >
          <svg viewBox="0 0 32 32" className="h-24 w-24 md:h-32 md:w-32">
            <defs>
              <radialGradient id="heartGrad" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="hsl(330 100% 88%)" />
                <stop offset="60%" stopColor="hsl(340 90% 68%)" />
                <stop offset="100%" stopColor="hsl(320 80% 50%)" />
              </radialGradient>
            </defs>
            <path
              fill="url(#heartGrad)"
              d="M16 28s-11-7.2-11-15a6.5 6.5 0 0 1 11-4.6A6.5 6.5 0 0 1 27 13c0 7.8-11 15-11 15z"
            />
          </svg>
        </motion.div>

        <Typewriter
          lines={[
            "No matter what I am to you…",
            "I'll always wish you happiness",
            "Keep smiling, Deva Darshini ✨",
            "Once again, Happy Birthday ❤️",
          ]}
          speed={48}
          linePause={550}
          startDelay={600}
          className="space-y-4"
          lineClassName="font-serif text-2xl leading-relaxed text-foreground text-glow-soft md:text-3xl"
          onComplete={() => setDone(true)}
        />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-3"
        >
          <GlowButton variant="ghost" onClick={onBack}>← Back</GlowButton>
          <GlowButton onClick={onReplay}>↻ Replay</GlowButton>
        </motion.div>
      </div>
    </section>
  );
};
