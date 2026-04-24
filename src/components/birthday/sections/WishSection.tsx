import { motion } from "framer-motion";
import { FloatingParticles } from "../Atmosphere";
import { GlowButton } from "../GlowButton";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export const WishSection = ({ onNext, onBack }: Props) => {
  return (
    <section className="relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-night px-6">
      <FloatingParticles count={28} />

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center gap-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full"
        >
          <div className="relative animate-breathe rounded-3xl glass p-10 text-center md:p-14">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              className="font-script text-5xl text-glow-rose md:text-7xl"
              style={{ color: "hsl(var(--primary))" }}
            >
              Happy Birthday
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="mt-2 font-serif text-3xl text-foreground text-glow-soft md:text-4xl"
            >
              Deva Darshini 🎂
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
              className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              Wishing you happiness, smiles, and everything you dream of.
            </motion.p>

            {/* Sparkles */}
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute h-1.5 w-1.5 rounded-full bg-primary-glow"
                style={{
                  top: `${10 + Math.random() * 80}%`,
                  left: `${5 + Math.random() * 90}%`,
                  boxShadow: "0 0 12px hsl(var(--primary-glow))",
                }}
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.4, 0.8] }}
                transition={{ duration: 2.4 + Math.random() * 1.5, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="flex items-center gap-3"
        >
          <GlowButton variant="ghost" onClick={onBack}>← Back</GlowButton>
          <GlowButton onClick={onNext}>Continue →</GlowButton>
        </motion.div>
      </div>
    </section>
  );
};
