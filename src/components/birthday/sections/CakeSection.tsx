import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Mic, MicOff } from "lucide-react";
import { GlowButton } from "../GlowButton";

interface Props {
  onNext: () => void;
  onBack: () => void;
  soundEnabled: boolean;
}

type MicState = "idle" | "requesting" | "listening" | "denied" | "unsupported";

const playCelebrationSound = () => {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = ctx.currentTime;
    // Sweet 3-note celebration arpeggio
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
  const end = Date.now() + 1500;
  const colors = ["#ff8fc7", "#c8b6ff", "#ffd1e8", "#ffd27a", "#ffffff"];
  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors });
    confetti({ particleCount: 6, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({ particleCount: 140, spread: 110, origin: { y: 0.6 }, colors, scalar: 1.1 });
};

export const CakeSection = ({ onNext, onBack, soundEnabled }: Props) => {
  const [blown, setBlown] = useState(false);
  const [micState, setMicState] = useState<MicState>("idle");
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const blownRef = useRef(false);

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

  const startMic = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicState("unsupported");
      return;
    }
    try {
      setMicState("requesting");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
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
        // RMS volume
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        if (rms > 0.18) {
          sustained += 1;
          if (sustained > 4) {
            triggerBlow();
            return;
          }
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

  useEffect(() => {
    startMic();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-night px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >
        <h2 className="font-serif text-3xl text-foreground text-glow-soft md:text-4xl">
          Make a wish, Deva Darshini…
        </h2>
        <p className="mt-2 text-sm text-muted-foreground md:text-base">And blow the candle 🕯️</p>
      </motion.div>

      {/* Cake */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative mt-8 select-none"
      >
        {/* Candle + flame */}
        <div className="relative mx-auto flex flex-col items-center" style={{ width: 220 }}>
          {/* Flame */}
          <div className="relative h-16 w-10">
            <AnimatePresence>
              {!blown && (
                <motion.div
                  key="flame"
                  exit={{ opacity: 0, y: -30, scale: 0.4 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div
                    className="animate-flicker mx-auto h-12 w-6 rounded-full"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 80%, #fff7c2 0%, #ffd27a 30%, #ff7a3d 65%, transparent 100%)",
                      boxShadow: "var(--glow-candle)",
                    }}
                  />
                  <div
                    className="absolute left-1/2 top-2 h-3 w-2 -translate-x-1/2 rounded-full"
                    style={{ background: "#7ec8ff", filter: "blur(1px)", opacity: 0.7 }}
                  />
                </motion.div>
              )}
              {blown && (
                <motion.div
                  key="smoke"
                  initial={{ opacity: 0.7, y: 0 }}
                  animate={{ opacity: 0, y: -50 }}
                  transition={{ duration: 1.6 }}
                  className="absolute left-1/2 top-2 h-10 w-2 -translate-x-1/2 rounded-full"
                  style={{ background: "rgba(220,220,255,0.5)", filter: "blur(4px)" }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Wick */}
          <div className="h-2 w-1 bg-zinc-800" />
          {/* Candle body */}
          <div className="h-20 w-5 rounded-sm bg-gradient-to-b from-pink-200 to-pink-400 shadow-md" />

          {/* Cake top */}
          <div className="-mt-1 h-8 w-40 rounded-t-lg bg-gradient-to-b from-pink-200 to-pink-300 shadow-md" />
          {/* Top tier */}
          <div className="relative h-16 w-44 bg-gradient-to-b from-rose-300 to-rose-400 shadow-lg">
            {/* drip */}
            <svg viewBox="0 0 176 24" className="absolute -top-3 left-0 h-6 w-full" preserveAspectRatio="none">
              <path d="M0,0 Q22,28 44,8 Q66,30 88,6 Q110,28 132,10 Q154,30 176,6 L176,24 L0,24 Z" fill="hsl(330 80% 78%)" />
            </svg>
            {/* sprinkles */}
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className="absolute h-1.5 w-0.5 rounded-full"
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${5 + Math.random() * 90}%`,
                  background: ["#fff", "#c8b6ff", "#ffd27a", "#ff8fc7"][i % 4],
                  transform: `rotate(${Math.random() * 180}deg)`,
                }}
              />
            ))}
          </div>
          {/* Base tier */}
          <div className="relative h-20 w-56 bg-gradient-to-b from-rose-400 to-rose-500 shadow-xl">
            <svg viewBox="0 0 224 24" className="absolute -top-3 left-0 h-6 w-full" preserveAspectRatio="none">
              <path d="M0,0 Q28,28 56,8 Q84,30 112,6 Q140,28 168,10 Q196,30 224,6 L224,24 L0,24 Z" fill="hsl(335 75% 70%)" />
            </svg>
          </div>
          {/* Plate */}
          <div className="-mt-1 h-2 w-64 rounded-full bg-gradient-to-r from-pink-100/30 via-pink-100/60 to-pink-100/30 blur-[1px]" />

          {/* Glow halo */}
          <AnimatePresence>
            {!blown && (
              <motion.div
                key="halo"
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.6 }}
                className="pointer-events-none absolute -top-6 left-1/2 h-44 w-44 -translate-x-1/2 rounded-full"
                style={{
                  background: "radial-gradient(circle, hsl(38 100% 65% / 0.55) 0%, transparent 70%)",
                  filter: "blur(8px)",
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Mic status */}
      <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
        {micState === "listening" && (
          <>
            <Mic className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span>Listening… try blowing into the mic 💨</span>
          </>
        )}
        {micState === "requesting" && <span>Requesting microphone…</span>}
        {(micState === "denied" || micState === "unsupported") && (
          <>
            <MicOff className="h-3.5 w-3.5" />
            <span>Mic unavailable — use the button below</span>
          </>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-6 flex items-center gap-3">
        <GlowButton variant="ghost" onClick={onBack}>← Back</GlowButton>
        {!blown ? (
          <GlowButton onClick={triggerBlow}>💨 Blow Candle</GlowButton>
        ) : (
          <GlowButton onClick={onNext}>Continue →</GlowButton>
        )}
      </div>

      {/* Wish granted message */}
      <AnimatePresence>
        {blown && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 text-center font-serif text-2xl text-glow-rose md:text-3xl"
          >
            May all your wishes come true ❤️
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  );
};
