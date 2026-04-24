import { useEffect, useMemo, useRef, useState } from "react";

interface TypewriterProps {
  lines: string[];
  speed?: number;       // ms per char
  linePause?: number;   // ms between lines after typing
  className?: string;
  lineClassName?: string;
  startDelay?: number;
  onComplete?: () => void;
}

/**
 * Sequentially types each line with a blinking caret, then fades it in
 * permanently and starts the next line. Calls onComplete after the last line.
 */
export const Typewriter = ({
  lines,
  speed = 55,
  linePause = 650,
  className,
  lineClassName,
  startDelay = 250,
  onComplete,
}: TypewriterProps) => {
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  useEffect(() => {
    if (!started) return;
    if (lineIdx >= lines.length) return;

    const current = lines[lineIdx];
    if (charIdx < current.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), speed);
      return () => clearTimeout(t);
    }
    // line complete
    if (lineIdx < lines.length - 1) {
      const t = setTimeout(() => {
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      }, linePause);
      return () => clearTimeout(t);
    } else if (!completedRef.current) {
      completedRef.current = true;
      const t = setTimeout(() => onComplete?.(), 400);
      return () => clearTimeout(t);
    }
  }, [started, charIdx, lineIdx, lines, speed, linePause, onComplete]);

  return (
    <div className={className}>
      {lines.map((line, i) => {
        if (i > lineIdx) return null;
        const isCurrent = i === lineIdx;
        const text = isCurrent ? line.slice(0, charIdx) : line;
        return (
          <p
            key={i}
            className={`${lineClassName ?? ""} ${isCurrent ? "caret" : ""} animate-[fade-in_0.6s_ease-out_both]`}
          >
            {text}
          </p>
        );
      })}
    </div>
  );
};

interface FloatingParticlesProps {
  count?: number;
  className?: string;
  colorClass?: string; // e.g. "bg-primary"
}

export const FloatingParticles = ({
  count = 36,
  className = "",
  colorClass = "bg-primary-glow",
}: FloatingParticlesProps) => {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const size = Math.random() * 4 + 2;
        return {
          id: i,
          left: Math.random() * 100,
          bottom: -10 - Math.random() * 30,
          size,
          duration: 14 + Math.random() * 16,
          delay: Math.random() * 14,
          dx: (Math.random() - 0.5) * 80,
          opacity: 0.4 + Math.random() * 0.5,
        };
      }),
    [count],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((p) => (
        <span
          key={p.id}
          className={`absolute rounded-full ${colorClass}`}
          style={{
            left: `${p.left}%`,
            bottom: `${p.bottom}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px hsl(var(--primary-glow) / 0.8)`,
            animation: `drift ${p.duration}s linear ${p.delay}s infinite`,
            // @ts-expect-error custom CSS prop
            "--dx": `${p.dx}px`,
          }}
        />
      ))}
    </div>
  );
};
