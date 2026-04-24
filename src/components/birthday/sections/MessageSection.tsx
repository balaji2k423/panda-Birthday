import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Typewriter } from "../Atmosphere";
import { GlowButton } from "../GlowButton";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export const MessageSection = ({ onNext, onBack }: Props) => {
  const [done, setDone] = useState(false);

  const petals = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 14,
        duration: 12 + Math.random() * 10,
        delay: Math.random() * 8,
        dx: (Math.random() - 0.5) * 120,
      })),
    [],
  );

  return (
    <section className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-dawn px-6">
      {/* Falling petals */}
      <div className="pointer-events-none absolute inset-0">
        {petals.map((p) => (
          <span
            key={p.id}
            className="absolute -top-12 block rounded-full"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 0.7,
              background: "radial-gradient(circle at 30% 30%, hsl(330 90% 85%), hsl(320 80% 70%))",
              boxShadow: "0 0 12px hsl(330 90% 75% / 0.6)",
              opacity: 0.65,
              animation: `petal-fall ${p.duration}s linear ${p.delay}s infinite`,
              // @ts-expect-error custom CSS prop
              "--dx": `${p.dx}px`,
              borderRadius: "60% 40% 60% 40%",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <Typewriter
          lines={[
            "I may just be your friend…",
            "But I really value you more than you know",
            "You bring a kind of calm and happiness that's rare",
            "And today, I just wanted to make you feel a little special",
          ]}
          speed={42}
          linePause={550}
          className="space-y-5"
          lineClassName="font-serif text-2xl leading-relaxed text-foreground text-glow-soft md:text-3xl"
          onComplete={() => setDone(true)}
        />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.7 }}
          className="mt-12 flex items-center justify-center gap-3"
        >
          <GlowButton variant="ghost" onClick={onBack}>← Back</GlowButton>
          <GlowButton onClick={onNext} disabled={!done}>Continue →</GlowButton>
        </motion.div>
      </div>
    </section>
  );
};
