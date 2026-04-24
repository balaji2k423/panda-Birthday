import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FloatingParticles } from "../Atmosphere";
import { GlowButton } from "../GlowButton";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const QUOTES = [
  {
    text: "May your day be as warm as your smile and as bright as the joy you bring to everyone around you.",
    attr: "— for you, always",
  },
  {
    text: "You are not just a year older — you are a year more wonderful, more radiant, more you.",
    attr: "— written with love",
  },
  {
    text: "Every candle on your cake is a star that has been shining for you all year long.",
    attr: "— on this beautiful day",
  },
];

const MOODS = [
  { icon: "🌸", label: "Joy" },
  { icon: "✨", label: "Magic" },
  { icon: "💫", label: "Love" },
];

/** Renders words as individual spans so JS can fade them one-by-one */
const WordSpans = ({ text }: { text: string }) => (
  <>
    {text.split(" ").map((word, i) => (
      <span
        key={i}
        data-word
        style={{
          display: "inline-block",
          marginRight: "0.28em",
          opacity: 0,
          transition: "opacity 0.42s ease",
        }}
      >
        {word}
      </span>
    ))}
  </>
);

export const WishSection = ({ onNext, onBack }: Props) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [renderKey, setRenderKey] = useState(0);
  const busyRef = useRef(false);
  const qtRef = useRef<HTMLParagraphElement>(null);
  const qaRef = useRef<HTMLParagraphElement>(null);

  /** Fade every word in left→right */
  const fadeIn = useCallback(() => {
    const words = qtRef.current?.querySelectorAll<HTMLSpanElement>("[data-word]") ?? [];
    words.forEach((w, i) =>
      setTimeout(() => {
        w.style.opacity = "1";
      }, i * 48 + 80)
    );
    if (qaRef.current) {
      setTimeout(() => {
        qaRef.current!.style.opacity = "1";
      }, words.length * 48 + 200);
    }
    setTimeout(() => {
      busyRef.current = false;
    }, words.length * 48 + 700);
  }, []);

  /** Fade every word out left→right, then swap quote, then fade in */
  const goTo = useCallback(
    (next: number) => {
      if (busyRef.current) return;
      busyRef.current = true;

      const words = qtRef.current?.querySelectorAll<HTMLSpanElement>("[data-word]") ?? [];
      words.forEach((w, i) =>
        setTimeout(() => {
          w.style.transition = "opacity 0.38s ease";
          w.style.opacity = "0";
        }, i * 42)
      );
      if (qaRef.current) {
        qaRef.current.style.transition = "opacity 0.3s";
        qaRef.current.style.opacity = "0";
      }

      const outMs = words.length * 42 + 420;
      setTimeout(() => {
        setQuoteIndex(next);
        setRenderKey((k) => k + 1);
      }, outMs);
    },
    []
  );

  // Fade in whenever quote changes (renderKey bumps)
  useEffect(() => {
    // tiny delay so DOM has painted new words
    const t = setTimeout(fadeIn, 30);
    return () => clearTimeout(t);
  }, [renderKey, fadeIn]);

  // Initial fade-in on mount
  useEffect(() => {
    const t = setTimeout(fadeIn, 400);
    return () => clearTimeout(t);
  }, []);

  // Auto-cycle
  useEffect(() => {
    const timer = setInterval(() => {
      goTo((quoteIndex + 1) % QUOTES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [quoteIndex, goTo]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="relative flex min-h-full w-full flex-col items-center justify-between overflow-hidden bg-gradient-night px-5 py-10 gap-0">
      <FloatingParticles count={28} />

      <motion.div
        className="relative z-10 flex w-full flex-col items-center gap-0 h-full"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* ── Top bar ── */}
        <motion.div variants={item} className="flex w-full items-center justify-between mb-7">
          <span className="rounded-full border border-rose-400/20 bg-white/5 px-3.5 py-1 text-[11px] uppercase tracking-widest text-rose-300">
            ✦ 25 April 2005
          </span>
          <span className="text-[11px] uppercase tracking-wider text-foreground/30">
            21 years ✨
          </span>
        </motion.div>

        {/* ── Title ── */}
        <motion.div variants={item} className="mb-5 text-center w-full">
          <span
            className="font-script text-5xl block text-glow-rose"
            style={{ color: "hsl(var(--primary))" }}
          >
            Happy Birthday
          </span>
          <span className="font-serif text-2xl font-bold text-foreground mt-1.5 block tracking-wide">
            Deva Darshini 🎂
          </span>
        </motion.div>

        {/* ── Orbital ring ── */}
        <motion.div variants={item} className="mb-5 flex justify-center">
          <div className="relative w-28 h-28">
            <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[72px] h-[72px] rounded-full border border-rose-400/25 bg-rose-400/[0.07] flex items-center justify-center text-3xl">
              🌸
            </div>
            {/* orbiting dots via CSS animation defined in global styles or inline keyframes */}
            {[
              { size: 7, color: "#f9a8c9", shadow: "rgba(249,168,201,0.8)", angle: 0, speed: "3.2s", radius: 52 },
              { size: 5, color: "#c084fc", shadow: "rgba(192,132,252,0.8)", angle: 120, speed: "3.2s", radius: 52 },
              { size: 4, color: "#fff", shadow: "#fff", angle: 240, speed: "3.2s", radius: 52 },
            ].map((dot, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full"
                style={{
                  width: dot.size,
                  height: dot.size,
                  background: dot.color,
                  boxShadow: `0 0 10px ${dot.shadow}`,
                  top: "50%",
                  left: "50%",
                  x: -dot.size / 2,
                  y: -dot.size / 2,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "linear", delay: (dot.angle / 360) * 3.2 }}
                // Wrap in a parent to translate on radius
              />
            ))}
          </div>
        </motion.div>

        {/* ── Divider ── */}
        <motion.div variants={item} className="flex w-full items-center gap-2.5 mb-5">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-400/25 to-transparent" />
          <span className="text-rose-400/40 text-xs">✦</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-rose-400/25 to-transparent" />
        </motion.div>

        {/* ── Quote area ── */}
        <motion.div variants={item} className="w-full flex flex-col items-center mb-4">
          <span
            className="font-serif text-5xl self-start pl-2 leading-none select-none"
            style={{ color: "rgba(249,168,201,0.18)" }}
          >
            "
          </span>

          <div className="min-h-[80px] px-2 flex flex-col items-center justify-center gap-2 text-center">
            <p
              ref={qtRef}
              className="font-serif italic text-[15.5px] leading-[1.68] text-foreground/85"
            >
              <WordSpans key={`words-${quoteIndex}`} text={QUOTES[quoteIndex].text} />
            </p>
            <p
              ref={qaRef}
              className="text-[11px] uppercase tracking-wider text-foreground/28"
              style={{ opacity: 0, transition: "opacity 0.5s ease" }}
            >
              {QUOTES[quoteIndex].attr}
            </p>
          </div>

          <span
            className="font-serif text-5xl self-end pr-2 leading-none select-none rotate-180"
            style={{ color: "rgba(249,168,201,0.18)" }}
          >
            "
          </span>
        </motion.div>

        {/* ── Dot indicators ── */}
        <motion.div variants={item} className="flex gap-1.5 mb-5">
          {QUOTES.map((_, i) => (
            <button
              key={i}
              aria-label={`Quote ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-[5px] rounded-full transition-all duration-400 ${
                i === quoteIndex ? "w-[22px] bg-primary" : "w-[5px] bg-primary/25"
              }`}
            />
          ))}
        </motion.div>

        {/* ── Mood pills ── */}
        <motion.div variants={item} className="grid grid-cols-3 gap-2 w-full mb-5">
          {MOODS.map(({ icon, label }) => (
            <div
              key={label}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] py-2.5 text-center"
            >
              <span className="block text-lg mb-1">{icon}</span>
              <span className="block text-[10px] uppercase tracking-wider text-foreground/35">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Buttons ── */}
        <motion.div variants={item} className="flex w-full items-center gap-2.5">
          <GlowButton variant="ghost" onClick={onBack} className="flex-1">
            ← Back
          </GlowButton>
          <GlowButton onClick={onNext} className="flex-1">
            Continue →
          </GlowButton>
        </motion.div>
      </motion.div>
    </section>
  );
};