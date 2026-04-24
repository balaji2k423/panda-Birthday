import { useMemo, useState } from "react";
import { motion } from "framer-motion";

// ── Inline stand-ins for components not available in this sandbox ──
const Typewriter = ({
  lines,
  speed,
  linePause,
  className,
  lineClassName,
  onComplete,
}: {
  lines: string[];
  speed: number;
  linePause: number;
  className?: string;
  lineClassName?: string;
  onComplete?: () => void;
}) => {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentText, setCurrentText] = useState("");

  useState(() => {
    let lineIdx = 0;
    let charIdx = 0;

    const tick = () => {
      if (lineIdx >= lines.length) {
        onComplete?.();
        return;
      }
      const line = lines[lineIdx];
      if (charIdx <= line.length) {
        setCurrentText(line.slice(0, charIdx));
        charIdx++;
        setTimeout(tick, speed);
      } else {
        setVisibleLines((prev) => [...prev, line]);
        setCurrentLine(++lineIdx);
        setCurrentText("");
        charIdx = 0;
        setTimeout(tick, linePause);
      }
    };
    tick();
  });

  return (
    <div className={className}>
      {visibleLines.map((line, i) => (
        <p key={i} className={lineClassName}>
          {line}
        </p>
      ))}
      {currentLine < lines.length && (
        <p className={lineClassName}>
          {currentText}
          <span
            style={{
              display: "inline-block",
              width: "2px",
              height: "1em",
              background: "hsl(330 80% 75%)",
              marginLeft: "2px",
              verticalAlign: "text-bottom",
              animation: "blink 0.9s step-end infinite",
            }}
          />
        </p>
      )}
    </div>
  );
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
      padding: "10px 28px",
      borderRadius: "999px",
      border: variant === "ghost" ? "1px solid hsl(330 60% 70% / 0.4)" : "1px solid hsl(330 80% 75% / 0.6)",
      background:
        variant === "ghost"
          ? "transparent"
          : disabled
            ? "hsl(330 40% 60% / 0.2)"
            : "linear-gradient(135deg, hsl(330 80% 72% / 0.85), hsl(310 70% 65% / 0.85))",
      color: disabled ? "hsl(330 40% 75%)" : "hsl(330 90% 95%)",
      fontSize: "15px",
      fontFamily: "inherit",
      cursor: disabled ? "not-allowed" : "pointer",
      letterSpacing: "0.03em",
      backdropFilter: "blur(8px)",
      transition: "all 0.2s ease",
      boxShadow: disabled ? "none" : variant === "ghost" ? "none" : "0 4px 24px hsl(330 80% 65% / 0.35)",
    }}
  >
    {children}
  </button>
);

// ─────────────────────────────────────────────

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400&display=swap');

        @keyframes petal-fall {
          0%   { transform: translateY(-60px) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.65; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(110vh) translateX(var(--dx)) rotate(360deg); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes shimmer-slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes float-card {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); opacity: 0.6; }
          100% { transform: scale(1.05); opacity: 0; }
        }
      `}</style>

      <section
        style={{
          position: "relative",
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, hsl(340 60% 12%) 0%, hsl(320 50% 18%) 35%, hsl(300 40% 14%) 70%, hsl(340 55% 10%) 100%)",
          padding: "24px",
          fontFamily: "'Jost', sans-serif",
        }}
      >
        {/* Ambient radial glows */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse 70% 50% at 30% 40%, hsl(330 80% 30% / 0.25) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 75% 70%, hsl(310 70% 25% / 0.2) 0%, transparent 65%)",
          }}
        />

        {/* Falling petals — UNCHANGED */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {petals.map((p) => (
            <span
              key={p.id}
              style={{
                position: "absolute",
                top: "-48px",
                display: "block",
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

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: "640px",
            animation: "float-card 6s ease-in-out 1.5s infinite",
          }}
        >
          {/* Pulse ring behind card */}
          <div
            style={{
              position: "absolute",
              inset: "-2px",
              borderRadius: "28px",
              border: "1px solid hsl(330 80% 70% / 0.25)",
              animation: "pulse-ring 3s ease-out 2s infinite",
              pointerEvents: "none",
            }}
          />

          {/* Card body */}
          <div
            style={{
              background:
                "linear-gradient(145deg, hsl(340 50% 14% / 0.85) 0%, hsl(320 45% 12% / 0.9) 100%)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid hsl(330 70% 70% / 0.18)",
              borderRadius: "24px",
              padding: "56px 52px 48px",
              boxShadow:
                "0 0 0 1px hsl(330 50% 50% / 0.08) inset, 0 32px 80px hsl(330 80% 10% / 0.6), 0 0 60px hsl(330 70% 30% / 0.15)",
              textAlign: "center",
            }}
          >
            {/* Top ornament */}
            <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
              <div style={{ height: "1px", width: "48px", background: "linear-gradient(to right, transparent, hsl(330 70% 65% / 0.5))" }} />
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1 L10.5 7 L16 6 L11.5 10 L14 16 L9 12.5 L4 16 L6.5 10 L2 6 L7.5 7 Z" fill="hsl(330 80% 75%)" opacity="0.8" />
              </svg>
              <div style={{ height: "1px", width: "48px", background: "linear-gradient(to left, transparent, hsl(330 70% 65% / 0.5))" }} />
            </div>

            {/* Typewriter text */}
            <Typewriter
              lines={[
                "I may just be your friend…",
                "But I really value you more than you know",
                "You bring a kind of calm and happiness that's rare",
                "And today, I just wanted to make you feel a little special",
              ]}
              speed={42}
              linePause={550}
              className=""
              lineClassName=""
              onComplete={() => setDone(true)}
            />

            {/* Shimmer divider */}
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                height: "1px",
                margin: "40px auto 0",
                width: "80%",
                background: "hsl(330 60% 60% / 0.15)",
                borderRadius: "1px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent 0%, hsl(330 90% 80% / 0.7) 50%, transparent 100%)",
                  width: "25%",
                  animation: "shimmer-slide 3s ease-in-out 2s infinite",
                }}
              />
            </div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={done ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{ marginTop: "40px", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}
            >
              <GlowButton variant="ghost" onClick={onBack}>← Back</GlowButton>
              <GlowButton onClick={onNext} disabled={!done}>Continue →</GlowButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Inline typewriter styles */}
        <style>{`
          .tw-line {
            font-family: 'Cormorant Garamond', serif;
            font-size: clamp(20px, 3.5vw, 28px);
            font-weight: 300;
            line-height: 1.75;
            color: hsl(330 60% 92%);
            text-shadow: 0 0 32px hsl(330 80% 65% / 0.4), 0 1px 3px hsl(330 50% 20% / 0.5);
            margin: 0 0 4px;
            letter-spacing: 0.01em;
          }
          .tw-line:first-child { font-style: italic; color: hsl(330 65% 85%); }
        `}</style>
      </section>
    </>
  );
};

// ── Preview wrapper ──
export default function Preview() {
  const [step, setStep] = useState(0);
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <MessageSection onNext={() => setStep(1)} onBack={() => setStep(-1)} />
      {step === 1 && (
        <div style={{ position: "fixed", top: 16, right: 16, color: "white", fontFamily: "sans-serif", background: "rgba(0,0,0,0.5)", padding: "8px 16px", borderRadius: "8px" }}>
          → onNext fired
        </div>
      )}
    </div>
  );
}