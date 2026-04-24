import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FloatingParticles } from "../Atmosphere";
import { GlowButton } from "../GlowButton";

interface Props {
  onNext: () => void;
}

const BIRTH = new Date("2005-04-25T00:00:00");

function useAge() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const ms = now.getTime() - BIRTH.getTime();
  const totalSec = Math.floor(ms / 1000);
  const totalHours = Math.floor(ms / 3_600_000);
  const totalDays = Math.floor(ms / 86_400_000);
  const years = Math.floor(totalDays / 365.25);
  const remDays = Math.floor(totalDays - years * 365.25);
  const remHours = Math.floor(totalHours - totalDays * 24);
  const remMin = Math.floor(ms / 60_000 - totalHours * 60);

  const fmt = (n: number) =>
    n >= 1e9 ? `${(n / 1e9).toFixed(1)}B`
    : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M`
    : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K`
    : n.toString();

  return { years, remDays, remHours, remMin, totalDays, totalHours, totalSec, fmt };
}

export const IntroSection = ({ onNext }: Props) => {
  const { years, remDays, remHours, remMin, totalDays, totalHours, totalSec, fmt } =
    useAge();

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.18 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="relative flex min-h-full w-full flex-col items-center justify-between overflow-hidden bg-gradient-night px-6 py-12 gap-6">
      <FloatingParticles count={42} />

      <motion.div
        className="relative z-10 w-full flex flex-col items-center gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Top badge */}
        <motion.div variants={item}>
          <span className="rounded-full border border-rose-400/30 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-rose-300 backdrop-blur-sm">
            ✦ April 25, 2005 ✦
          </span>
        </motion.div>

        {/* Petal + name */}
        <motion.div variants={item} className="flex flex-col items-center gap-2 text-center">
          <span className="text-5xl animate-bounce-slow">🌸</span>
          <h1 className="font-serif text-4xl font-bold leading-tight text-glow-rose text-foreground">
            Hey Deva 🐼 ❤️
          </h1>
          <p className="text-xs uppercase tracking-[0.15em] text-foreground/40">
            {years} beautiful years today
          </p>
        </motion.div>

        {/* Live age panel */}
        <motion.div
          variants={item}
          className="w-full rounded-2xl border border-rose-400/20 bg-white/5 p-5 backdrop-blur-md"
        >
          <p className="mb-1 text-[10px] uppercase tracking-widest text-foreground/40">
            You have been alive for
          </p>
          <p className="font-serif text-6xl text-foreground text-glow-rose">{years}</p>
          <p className="mb-4 text-xs text-foreground/40">
            years, {remDays} days, {remHours}h {remMin}m
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Days", val: fmt(totalDays) },
              { label: "Hours", val: fmt(totalHours) },
              { label: "Seconds", val: fmt(totalSec) },
            ].map(({ label, val }) => (
              <div key={label} className="rounded-xl bg-white/[0.06] p-2.5 text-center">
                <span className="block font-serif text-xl text-rose-300">{val}</span>
                <span className="mt-0.5 block text-[10px] uppercase tracking-wider text-foreground/40">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div variants={item} className="w-full px-1 text-center">
          <span className="font-serif text-5xl leading-none text-rose-400/30">"</span>
          <p className="font-serif text-base italic leading-relaxed text-foreground/80 -mt-3">
            She was born with a heart full of stars — and the world has been brighter ever since.
          </p>
          <p className="mt-2 text-[11px] uppercase tracking-wider text-foreground/30">
            — written for you, today
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div variants={item} className="w-full">
          <GlowButton onClick={onNext} className="w-full">
            Start ✨
          </GlowButton>
        </motion.div>
      </motion.div>
    </section>
  );
};