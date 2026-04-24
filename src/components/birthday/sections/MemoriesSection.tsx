import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { GlowButton } from "../GlowButton";
import { FloatingParticles } from "../Atmosphere";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const CARDS = [
  {
    caption: "Little moments",
    sub: "that stay forever",
    emoji: "🌷",
    tag: "Memory 01",
    bg: "linear-gradient(145deg,#1a0533 0%,#3d1460 50%,#6b2fa0 100%)",
    circle: "#c084fc",
    shimmer: "#c084fc",
    orbSpeed: "14s",
    orbSpeed2: "9s",
  },
  {
    caption: "Random smiles",
    sub: "out of nowhere",
    emoji: "🌸",
    tag: "Memory 02",
    bg: "linear-gradient(145deg,#1f0520 0%,#5c1040 50%,#a0305a 100%)",
    circle: "#f472b6",
    shimmer: "#f472b6",
    orbSpeed: "11s",
    orbSpeed2: "7s",
  },
  {
    caption: "Simple memories",
    sub: "simple but precious",
    emoji: "🌙",
    tag: "Memory 03",
    bg: "linear-gradient(145deg,#040e2a 0%,#0f2060 50%,#1a3a9a 100%)",
    circle: "#60a5fa",
    shimmer: "#60a5fa",
    orbSpeed: "16s",
    orbSpeed2: "10s",
  },
  {
    caption: "But all special",
    sub: "in their own way",
    emoji: "✨",
    tag: "Memory 04",
    bg: "linear-gradient(145deg,#1a1005 0%,#5a3010 50%,#a06020 100%)",
    circle: "#fbbf24",
    shimmer: "#fbbf24",
    orbSpeed: "13s",
    orbSpeed2: "8s",
  },
];

const PEEK = [
  { x: 0,  y: 0,  scale: 1,    rotate: 0,   opacity: 1,    z: 10 },
  { x: 12, y: 16, scale: 0.92, rotate: 2.5, opacity: 0.5,  z: 5  },
  { x: 22, y: 28, scale: 0.85, rotate: 5,   opacity: 0.25, z: 2  },
  { x: 30, y: 38, scale: 0.79, rotate: 7,   opacity: 0,    z: 1  },
];

/** Rotating orbital ring with glowing pips */
const OrbitalRing = ({ speed, speed2, emoji }: { speed: string; speed2: string; emoji: string }) => (
  <div className="relative flex items-center justify-center w-[160px] h-[160px]">
    {/* Outer ring */}
    <div
      className="absolute w-[148px] h-[148px] rounded-full border border-white/10"
      style={{ animation: `spin ${speed} linear infinite` }}
    >
      {[0, 120, 240].map((deg) => (
        <span
          key={deg}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/60"
          style={{
            boxShadow: "0 0 8px rgba(255,255,255,0.8)",
            top: `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 74 - 3}px)`,
            left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 74 - 3}px)`,
          }}
        />
      ))}
    </div>
    {/* Inner dashed ring */}
    <div
      className="absolute w-[104px] h-[104px] rounded-full"
      style={{
        border: "1px dashed rgba(255,255,255,0.08)",
        animation: `spin ${speed2} linear infinite reverse`,
      }}
    />
    {/* Emoji */}
    <span
      className="text-[64px] select-none"
      style={{
        filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.4))",
        animation: "bob 3s ease-in-out infinite alternate",
      }}
    >
      {emoji}
    </span>
  </div>
);

export const MemoriesSection = ({ onNext, onBack }: Props) => {
  const [cur, setCur] = useState(0);
  const startX = useRef(0);

  const goTo = (n: number) => setCur(Math.max(0, Math.min(CARDS.length - 1, n)));

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  };
  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section className="relative flex min-h-full w-full flex-col items-center justify-between overflow-hidden bg-gradient-night px-5 py-10">
      {/* global keyframes injected once */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bob  { from { transform: translateY(0); } to { transform: translateY(-8px); } }
      `}</style>

      <FloatingParticles count={24} />

      <motion.div
        className="relative z-10 flex w-full flex-col items-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.p variants={item} className="mb-1 text-[11px] uppercase tracking-[0.14em] text-rose-400/55">
          ✦ A little collection
        </motion.p>
        <motion.h2 variants={item} className="mb-1 font-serif text-[28px] font-bold text-foreground text-center">
          A few little things…
        </motion.h2>
        <motion.p variants={item} className="mb-6 text-[12px] text-foreground/38 text-center">
          The kind of things that make you, you.
        </motion.p>

        {/* ── Card stack ── */}
        <motion.div variants={item} className="relative w-full h-[360px] mb-4">
          {CARDS.map((card, i) => {
            const off = i - cur;
            const gone = off < 0;
            const peek = PEEK[Math.min(Math.max(off, 0), PEEK.length - 1)];

            return (
              <motion.div
                key={card.tag}
                animate={{
                  x:       gone ? "-115%" : peek.x,
                  y:       gone ? 0       : peek.y,
                  scale:   gone ? 0.9     : peek.scale,
                  rotate:  gone ? -10     : peek.rotate,
                  opacity: gone ? 0       : peek.opacity,
                  zIndex:  gone ? 0       : peek.z,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="absolute inset-0 rounded-[30px] overflow-hidden select-none"
                style={{
                  background: card.bg,
                  boxShadow: off === 0 ? "0 32px 80px rgba(0,0,0,0.7)" : "0 12px 40px rgba(0,0,0,0.3)",
                  pointerEvents: off === 0 ? "auto" : "none",
                  cursor: off === 0 ? "grab" : "default",
                }}
                onPointerDown={(e) => { startX.current = e.clientX }}
                onPointerUp={(e) => {
                  const dx = e.clientX - startX.current;
                  if (Math.abs(dx) > 45) goTo(dx < 0 ? cur + 1 : cur - 1);
                }}
              >
                {/* Glass sheen */}
                <div className="pointer-events-none absolute inset-0 z-[1]"
                  style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.07) 0%,transparent 55%)" }} />

                {/* Big decorative circles */}
                <div className="pointer-events-none absolute -top-16 -right-16 w-[260px] h-[260px] rounded-full opacity-[0.17]"
                  style={{ background: card.circle }} />
                <div className="pointer-events-none absolute -bottom-20 -left-20 w-[200px] h-[200px] rounded-full opacity-[0.10]"
                  style={{ background: card.circle }} />

                {/* Content */}
                <div className="relative z-[2] flex flex-col justify-between h-full p-6">
                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-wider text-white/50 backdrop-blur-sm">
                      {card.tag}
                    </span>
                    <span className="font-serif text-[40px] font-bold leading-none text-white/10">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Center orbital */}
                  <div className="flex items-center justify-center flex-1 py-2">
                    <OrbitalRing speed={card.orbSpeed} speed2={card.orbSpeed2} emoji={card.emoji} />
                  </div>

                  {/* Bottom text */}
                  <div>
                    <div className="mb-2.5 h-px w-8 bg-white/30" />
                    <p className="font-serif italic text-[22px] text-white leading-tight mb-1"
                      style={{ textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>
                      {card.caption}
                    </p>
                    <p className="text-[11px] uppercase tracking-wider text-white/45">{card.sub}</p>
                  </div>
                </div>

                {/* Bottom shimmer line */}
                <div
                  className="pointer-events-none absolute bottom-0 left-0 right-0 h-[2px] opacity-60"
                  style={{ background: `linear-gradient(90deg,transparent,${card.shimmer},transparent)` }}
                />

                {/* Swipe hint — top card only */}
                {off === 0 && (
                  <p className="absolute bottom-5 right-5 z-[3] text-[10px] uppercase tracking-wider text-white/25">
                    swipe ›
                  </p>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Nav row ── */}
        <motion.div variants={item} className="flex w-full items-center justify-between mb-5">
          <div className="flex gap-1.5">
            {CARDS.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Card ${i + 1}`}
                className={`h-[4px] rounded-full transition-all duration-350 ${
                  i === cur ? "w-5 bg-primary" : "w-[4px] bg-primary/22"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => goTo(cur - 1)}
              disabled={cur === 0}
              className="w-9 h-9 rounded-full border border-white/10 bg-white/5 text-foreground/55 text-sm flex items-center justify-center disabled:opacity-20 hover:bg-white/10 transition-all"
            >←</button>
            <button
              onClick={() => goTo(cur + 1)}
              disabled={cur === CARDS.length - 1}
              className="w-9 h-9 rounded-full border border-white/10 bg-white/5 text-foreground/55 text-sm flex items-center justify-center disabled:opacity-20 hover:bg-white/10 transition-all"
            >→</button>
          </div>
        </motion.div>

        {/* ── Buttons ── */}
        <motion.div variants={item} className="flex w-full gap-2.5">
          <GlowButton variant="ghost" onClick={onBack} className="flex-1">← Back</GlowButton>
          <GlowButton onClick={onNext} className="flex-1">Continue →</GlowButton>
        </motion.div>
      </motion.div>
    </section>
  );
};