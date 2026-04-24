import { useEffect, useRef, useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─── Stub external deps for preview ───────────────────────────────────────────
const confetti = (opts?: unknown) => {
  // no-op stub
};

const GlowButton = ({
  children,
  onClick,
  disabled,
  variant,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: string;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: "11px 30px",
      borderRadius: "999px",
      border:
        variant === "ghost"
          ? "1px solid hsl(330 60% 70% / 0.35)"
          : "1px solid hsl(330 80% 75% / 0.55)",
      background:
        variant === "ghost"
          ? "transparent"
          : disabled
            ? "hsl(330 30% 50% / 0.2)"
            : "linear-gradient(135deg, hsl(330 80% 68% / 0.9), hsl(308 70% 60% / 0.9))",
      color: disabled ? "hsl(330 30% 70%)" : "hsl(330 100% 96%)",
      fontSize: "15px",
      fontFamily: "inherit",
      cursor: disabled ? "not-allowed" : "pointer",
      letterSpacing: "0.04em",
      backdropFilter: "blur(10px)",
      transition: "all 0.22s ease",
      boxShadow:
        disabled || variant === "ghost"
          ? "none"
          : "0 4px 28px hsl(330 80% 60% / 0.4)",
    }}
  >
    {children}
  </button>
);

// ─── Cake SVG ─────────────────────────────────────────────────────────────────
const CakeSVG = ({ blown }: { blown: boolean }) => (
  <svg
    viewBox="0 0 260 300"
    width="260"
    height="300"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: "drop-shadow(0 20px 40px hsl(330 80% 30% / 0.5))" }}
  >
    <defs>
      <radialGradient id="flameGrad" cx="50%" cy="70%" r="50%">
        <stop offset="0%" stopColor="#fff9c4" />
        <stop offset="35%" stopColor="#ffd54f" />
        <stop offset="70%" stopColor="#ff6f00" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
      <radialGradient id="flameInner" cx="50%" cy="80%" r="40%">
        <stop offset="0%" stopColor="#e3f2fd" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
      <radialGradient id="glowHalo" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="hsl(38 100% 65% / 0.6)" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
      <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(330 50% 95%)" />
        <stop offset="100%" stopColor="hsl(330 40% 88%)" />
      </linearGradient>
      <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(340 80% 68%)" />
        <stop offset="100%" stopColor="hsl(340 75% 55%)" />
      </linearGradient>
      <linearGradient id="midGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(330 75% 74%)" />
        <stop offset="100%" stopColor="hsl(330 70% 62%)" />
      </linearGradient>
      <linearGradient id="topGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(320 70% 82%)" />
        <stop offset="100%" stopColor="hsl(320 65% 72%)" />
      </linearGradient>
      <linearGradient id="frostingTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(340 100% 97%)" />
        <stop offset="100%" stopColor="hsl(330 90% 93%)" />
      </linearGradient>
      <linearGradient id="candleGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="hsl(50 95% 85%)" />
        <stop offset="100%" stopColor="hsl(45 90% 72%)" />
      </linearGradient>
      <filter id="blur2">
        <feGaussianBlur stdDeviation="2" />
      </filter>
      <filter id="blur5">
        <feGaussianBlur stdDeviation="5" />
      </filter>
    </defs>

    {/* ── Plate ── */}
    <ellipse cx="130" cy="278" rx="90" ry="10" fill="url(#plate)" opacity="0.9" />
    <ellipse cx="130" cy="276" rx="86" ry="7" fill="hsl(330 50% 97%)" opacity="0.6" />

    {/* ══ BASE TIER ══ */}
    {/* Base body */}
    <rect x="34" y="210" width="192" height="62" rx="4" fill="url(#baseGrad)" />
    {/* Base frosting top */}
    <ellipse cx="130" cy="210" rx="96" ry="10" fill="url(#frostingTop)" />
    {/* Base drips */}
    {[50, 72, 94, 116, 138, 160, 182, 204].map((x, i) => (
      <ellipse
        key={i}
        cx={x + 4}
        cy={219 + (i % 2 === 0 ? 5 : 9)}
        rx="6"
        ry={i % 2 === 0 ? 8 : 12}
        fill="hsl(340 100% 95%)"
        opacity="0.9"
      />
    ))}
    {/* Base decorative band */}
    <rect x="34" y="232" width="192" height="5" rx="2" fill="hsl(340 60% 80% / 0.4)" />
    {/* Base roses */}
    {[65, 108, 152, 195].map((x, i) => (
      <g key={i} transform={`translate(${x},248)`}>
        <circle r="7" fill="hsl(350 85% 78%)" />
        <circle r="4.5" fill="hsl(350 80% 82%)" />
        <circle r="2.5" fill="hsl(350 70% 88%)" />
        <circle cx="0" cy="-5" r="2" fill="hsl(350 80% 78%)" />
        <circle cx="5" cy="1" r="2" fill="hsl(350 80% 78%)" />
        <circle cx="-5" cy="1" r="2" fill="hsl(350 80% 78%)" />
        <circle cx="2" cy="4" r="2" fill="hsl(350 80% 78%)" />
        <circle cx="-2" cy="4" r="2" fill="hsl(350 80% 78%)" />
      </g>
    ))}
    {/* Leaves between roses */}
    {[86, 130, 173].map((x, i) => (
      <ellipse key={i} cx={x} cy={248} rx="5" ry="3" fill="hsl(140 50% 55%)" transform={`rotate(${i % 2 === 0 ? 20 : -20},${x},248)`} />
    ))}

    {/* ══ MIDDLE TIER ══ */}
    <rect x="58" y="152" width="144" height="62" rx="4" fill="url(#midGrad)" />
    <ellipse cx="130" cy="152" rx="72" ry="8" fill="url(#frostingTop)" />
    {[72, 92, 112, 132, 152, 172].map((x, i) => (
      <ellipse
        key={i}
        cx={x}
        cy={160 + (i % 2 === 0 ? 4 : 8)}
        rx="5"
        ry={i % 2 === 0 ? 7 : 11}
        fill="hsl(330 100% 96%)"
        opacity="0.9"
      />
    ))}
    <rect x="58" y="172" width="144" height="4" rx="2" fill="hsl(330 60% 75% / 0.4)" />
    {/* Mid sprinkles */}
    {Array.from({ length: 18 }).map((_, i) => {
      const x = 68 + (i * 7.5) % 128;
      const y = 178 + (i * 3.7) % 26;
      const colors = ["hsl(50 100% 75%)", "hsl(200 80% 80%)", "hsl(270 70% 80%)", "hsl(10 90% 78%)"];
      return (
        <rect
          key={i}
          x={x}
          y={y}
          width="2"
          height="6"
          rx="1"
          fill={colors[i % 4]}
          transform={`rotate(${(i * 37) % 180},${x + 1},${y + 3})`}
        />
      );
    })}
    {/* Mid roses */}
    {[85, 130, 175].map((x, i) => (
      <g key={i} transform={`translate(${x},196)`}>
        <circle r="6" fill="hsl(10 85% 76%)" />
        <circle r="4" fill="hsl(10 80% 82%)" />
        <circle r="2" fill="hsl(10 70% 88%)" />
        <circle cx="0" cy="-4" r="1.8" fill="hsl(10 80% 76%)" />
        <circle cx="4" cy="1" r="1.8" fill="hsl(10 80% 76%)" />
        <circle cx="-4" cy="1" r="1.8" fill="hsl(10 80% 76%)" />
      </g>
    ))}

    {/* ══ TOP TIER ══ */}
    <rect x="82" y="100" width="96" height="56" rx="4" fill="url(#topGrad)" />
    <ellipse cx="130" cy="100" rx="48" ry="7" fill="url(#frostingTop)" />
    {[90, 107, 124, 141, 158, 170].map((x, i) => (
      <ellipse
        key={i}
        cx={x}
        cy={108 + (i % 2 === 0 ? 3 : 7)}
        rx="4"
        ry={i % 2 === 0 ? 6 : 10}
        fill="hsl(320 100% 97%)"
        opacity="0.9"
      />
    ))}
    {/* Pearl border */}
    {[90, 102, 114, 126, 138, 150, 162].map((x, i) => (
      <circle key={i} cx={x} cy={102} r="2.5" fill="white" opacity="0.85" />
    ))}
    {/* Top sprinkles */}
    {Array.from({ length: 10 }).map((_, i) => {
      const x = 90 + (i * 9) % 80;
      const y = 116 + (i * 5.3) % 32;
      return (
        <circle key={i} cx={x} cy={y} r="2" fill={["#ffd54f","#f48fb1","#ce93d8","#80deea","#fff"][i % 5]} opacity="0.9" />
      );
    })}

    {/* ══ CANDLE ══ */}
    {/* Candle body */}
    <rect x="124" y="64" width="12" height="38" rx="3" fill="url(#candleGrad)" />
    {/* Candle stripes */}
    <rect x="124" y="70" width="12" height="3" rx="1" fill="hsl(330 80% 78% / 0.6)" />
    <rect x="124" y="80" width="12" height="3" rx="1" fill="hsl(330 80% 78% / 0.6)" />
    <rect x="124" y="90" width="12" height="3" rx="1" fill="hsl(330 80% 78% / 0.6)" />
    {/* Wick */}
    <line x1="130" y1="64" x2="130" y2="59" stroke="#5d4037" strokeWidth="1.5" strokeLinecap="round" />

    {/* ══ FLAME / SMOKE ══ */}
    <AnimatePresence>
      {!blown && (
        <motion.g
          key="flame"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.5 }}
        >
          {/* Glow halo */}
          <ellipse cx="130" cy="44" rx="32" ry="32" fill="url(#glowHalo)" filter="url(#blur5)" />
          {/* Outer flame */}
          <motion.path
            d="M130,20 C122,28 118,36 120,44 C122,52 126,56 130,57 C134,56 138,52 140,44 C142,36 138,28 130,20Z"
            fill="url(#flameGrad)"
            animate={{ scaleX: [1, 1.08, 0.95, 1.06, 1], scaleY: [1, 0.97, 1.04, 0.96, 1] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "130px 57px" }}
          />
          {/* Inner blue */}
          <motion.ellipse
            cx="130"
            cy="50"
            rx="4"
            ry="6"
            fill="url(#flameInner)"
            opacity="0.7"
            animate={{ scaleY: [1, 1.15, 0.9, 1.1, 1] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.g>
      )}
      {blown && (
        <motion.ellipse
          key="smoke"
          cx="130"
          cy="50"
          rx="4"
          ry="12"
          fill="hsl(240 30% 80% / 0.5)"
          filter="url(#blur2)"
          initial={{ opacity: 0.7, y: 0, scaleX: 1 }}
          animate={{ opacity: 0, y: -40, scaleX: 2.5 }}
          transition={{ duration: 2 }}
        />
      )}
    </AnimatePresence>
  </svg>
);

// ─── Main Component ────────────────────────────────────────────────────────────
type MicState = "idle" | "requesting" | "listening" | "denied" | "unsupported";

interface Props {
  onNext: () => void;
  onBack: () => void;
  soundEnabled?: boolean;
}

const playCelebrationSound = () => {
  try {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtxClass();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, now + i * 0.12 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.7);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch {
    /* ignore */
  }
};

const fireConfetti = () => {
  const end = Date.now() + 1800;
  const colors = ["#ff8fc7", "#c8b6ff", "#ffd1e8", "#ffd27a", "#ffffff"];
  (function frame() {
    confetti({ particleCount: 7, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors });
    confetti({ particleCount: 7, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({ particleCount: 160, spread: 120, origin: { y: 0.55 }, colors, scalar: 1.15 });
};

export const CakeSection = ({ onNext, onBack, soundEnabled = true }: Props) => {
  const [blown, setBlown] = useState(false);
  const [micState, setMicState] = useState<MicState>("idle");
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const blownRef = useRef(false);

  const stars = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        r: 0.5 + Math.random() * 1.5,
        dur: 2 + Math.random() * 3,
        delay: Math.random() * 4,
      })),
    [],
  );

  const cleanup = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
  };

  const triggerBlow = () => {
    if (blownRef.current) return;
    blownRef.current = true;
    setBlown(true);
    fireConfetti();
    if (soundEnabled) playCelebrationSound();
    cleanup();
  };

  // ── FIX: mic only starts on user gesture (required on iOS/Android) ──
  const startMic = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicState("unsupported");
      return;
    }
    try {
      setMicState("requesting");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      // Resume needed on iOS — AudioContext starts suspended until user gesture
      if (ctx.state === "suspended") await ctx.resume();
      ctxRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      setMicState("listening");

      let sustained = 0;
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        if (rms > 0.18) {
          sustained += 1;
          if (sustained > 4) { triggerBlow(); return; }
        } else {
          sustained = Math.max(0, sustained - 1);
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setMicState("denied");
    }
  };

  useEffect(() => () => cleanup(), []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Jost:wght@300;400&display=swap');

        @keyframes twinkle {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.85; }
        }
        @keyframes float-cake {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes wish-glow {
          0%, 100% { text-shadow: 0 0 20px hsl(340 80% 70% / 0.5), 0 0 40px hsl(320 70% 60% / 0.3); }
          50% { text-shadow: 0 0 30px hsl(340 80% 75% / 0.8), 0 0 60px hsl(320 70% 65% / 0.5); }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes mic-pulse {
          0%, 100% { box-shadow: 0 0 0 0 hsl(340 80% 65% / 0.6); }
          50% { box-shadow: 0 0 0 10px hsl(340 80% 65% / 0); }
        }
      `}</style>

      <section
        style={{
          position: "relative",
          display: "flex",
          height: "100%",
          minHeight: "100vh",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background:
            "radial-gradient(ellipse 80% 70% at 50% 0%, hsl(295 60% 14%) 0%, hsl(330 50% 10%) 50%, hsl(340 55% 8%) 100%)",
          padding: "28px 20px 40px",
          fontFamily: "'Jost', sans-serif",
          gap: "0",
        }}
      >
        {/* Stars */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          preserveAspectRatio="none"
        >
          {stars.map((s) => (
            <circle
              key={s.id}
              cx={`${s.x}%`}
              cy={`${s.y}%`}
              r={s.r}
              fill="white"
              style={{
                animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))}
        </svg>

        {/* Ambient blobs */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 60% 40% at 20% 80%, hsl(340 80% 30% / 0.2) 0%, transparent 70%), radial-gradient(ellipse 50% 35% at 80% 20%, hsl(280 70% 30% / 0.18) 0%, transparent 65%)",
        }} />

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: "8px" }}
        >
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(22px, 5vw, 34px)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "hsl(330 70% 92%)",
            margin: 0,
            letterSpacing: "0.01em",
            textShadow: "0 0 30px hsl(330 80% 65% / 0.45)",
          }}>
            Make a wish, Deva Darshini…
          </h2>
          <p style={{
            marginTop: "8px",
            fontSize: "14px",
            color: "hsl(330 50% 75%)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            and blow out the candle
          </p>
        </motion.div>

        {/* Cake */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ animation: "float-cake 5s ease-in-out 1s infinite", marginTop: "4px" }}
        >
          <CakeSVG blown={blown} />
        </motion.div>

        {/* Mic status badge */}
        <AnimatePresence mode="wait">
          {micState === "listening" && (
            <motion.div
              key="listening"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                marginTop: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "hsl(340 60% 20% / 0.7)",
                border: "1px solid hsl(340 70% 55% / 0.35)",
                borderRadius: "999px",
                padding: "7px 18px",
                fontSize: "13px",
                color: "hsl(330 80% 85%)",
                backdropFilter: "blur(10px)",
                animation: "mic-pulse 1.5s ease-in-out infinite",
              }}
            >
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "hsl(340 90% 65%)", display: "inline-block", animation: "mic-pulse 1.5s ease-in-out infinite" }} />
              Listening — blow into the mic 💨
            </motion.div>
          )}
          {micState === "requesting" && (
            <motion.div key="req" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ marginTop: "12px", fontSize: "13px", color: "hsl(330 60% 75%)" }}>
              Requesting microphone…
            </motion.div>
          )}
          {(micState === "denied" || micState === "unsupported") && (
            <motion.div key="denied" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ marginTop: "12px", fontSize: "13px", color: "hsl(340 60% 70%)", display: "flex", alignItems: "center", gap: "6px" }}>
              🎤 Mic unavailable — use the button below
            </motion.div>
          )}
          {micState === "idle" && !blown && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ marginTop: "12px", fontSize: "13px", color: "hsl(330 50% 70%)" }}>
              Tap the mic button to blow via microphone
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          style={{ marginTop: "18px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}
        >
          <GlowButton variant="ghost" onClick={onBack}>← Back</GlowButton>

          {!blown ? (
            <>
              {/* Mic button — user gesture required on mobile */}
              {micState === "idle" && (
                <GlowButton onClick={startMic}>🎤 Blow via Mic</GlowButton>
              )}
              <GlowButton onClick={triggerBlow}>💨 Blow Candle</GlowButton>
            </>
          ) : (
            <GlowButton onClick={onNext}>Continue →</GlowButton>
          )}
        </motion.div>

        {/* Wish granted */}
        <AnimatePresence>
          {blown && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ marginTop: "24px", textAlign: "center" }}
            >
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                fontSize: "clamp(20px, 4.5vw, 28px)",
                color: "hsl(340 80% 88%)",
                margin: 0,
                animation: "wish-glow 2.5s ease-in-out infinite",
              }}>
                May all your wishes come true ❤️
              </p>
              <p style={{ marginTop: "8px", fontSize: "13px", color: "hsl(330 50% 70%)", letterSpacing: "0.05em" }}>
                Your wish is on its way to the stars ✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

// Preview wrapper
export default function Preview() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <CakeSection onNext={() => alert("next")} onBack={() => alert("back")} soundEnabled={true} />
    </div>
  );
}