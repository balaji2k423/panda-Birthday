import { motion } from "framer-motion";
import { GlowButton } from "../GlowButton";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const cards = [
  { caption: "Little moments", gradient: "linear-gradient(135deg,#ffd1e8 0%,#c8b6ff 100%)", emoji: "🌷" },
  { caption: "Random smiles", gradient: "linear-gradient(135deg,#ffc1d6 0%,#ffa8c5 50%,#c8a8ff 100%)", emoji: "🌸" },
  { caption: "Simple memories", gradient: "linear-gradient(135deg,#e0c3fc 0%,#ffafd0 100%)", emoji: "🌙" },
  { caption: "But all special in their own way", gradient: "linear-gradient(135deg,#fbc7e7 0%,#a18cd1 100%)", emoji: "✨" },
];

export const MemoriesSection = ({ onNext, onBack }: Props) => (
  <section className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-night px-6 py-16">
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="font-serif text-3xl text-foreground text-glow-soft md:text-5xl"
    >
      A few little things…
    </motion.h2>
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="mt-3 max-w-xl text-center text-sm text-muted-foreground md:text-base"
    >
      The kind of things that make you, you.
    </motion.p>

    <div className="mt-10 grid w-full max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c, i) => (
        <motion.div
          key={c.caption}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.05, y: -4 }}
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-primary/20 p-1 shadow-card-soft transition-shadow hover:shadow-[0_25px_60px_-15px_hsl(330_90%_60%/0.6)]"
        >
          <div
            className="relative flex aspect-[4/5] flex-col items-center justify-end overflow-hidden rounded-[14px] p-5"
            style={{ background: c.gradient }}
          >
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl opacity-90 transition-transform duration-500 group-hover:scale-110">
              {c.emoji}
            </span>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <p className="relative z-10 text-center font-serif text-lg leading-snug text-white drop-shadow-md md:text-xl">
              {c.caption}
            </p>
            {/* hover glow */}
            <span className="pointer-events-none absolute inset-0 rounded-[14px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{ boxShadow: "inset 0 0 60px hsl(330 100% 80% / 0.6)" }} />
          </div>
        </motion.div>
      ))}
    </div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.3, duration: 0.6 }}
      className="mt-10 flex items-center gap-3"
    >
      <GlowButton variant="ghost" onClick={onBack}>← Back</GlowButton>
      <GlowButton onClick={onNext}>Continue →</GlowButton>
    </motion.div>
  </section>
);
