import { useState, useRef } from "react";
import { motion } from "framer-motion";

const GlowButton = ({ children, onClick, disabled, variant, className }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; variant?: string; className?: string;
}) => (
  <button onClick={onClick} disabled={disabled} className={className} style={{
    padding: "11px 20px", borderRadius: "999px", flex: 1,
    border: variant === "ghost" ? "1px solid hsl(330 60% 70%/0.35)" : "1px solid hsl(330 80% 75%/0.55)",
    background: variant === "ghost" ? "transparent" : "linear-gradient(135deg,hsl(330 80% 68%/0.9),hsl(308 70% 60%/0.9))",
    color: "hsl(330 100% 96%)", fontSize: "14px", fontFamily: "inherit",
    cursor: disabled ? "not-allowed" : "pointer", letterSpacing: "0.04em",
    backdropFilter: "blur(10px)", transition: "all 0.22s ease",
    boxShadow: variant === "ghost" ? "none" : "0 4px 28px hsl(330 80% 60%/0.4)",
    opacity: disabled ? 0.4 : 1,
  }}>{children}</button>
);

const FloatingParticles = ({ count }: { count: number }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i, x: Math.random() * 100, size: 2 + Math.random() * 3,
    dur: 8 + Math.random() * 12, delay: Math.random() * 8,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", left: `${p.x}%`, bottom: "-10px",
          width: p.size, height: p.size, borderRadius: "50%",
          background: "hsl(330 80% 75% / 0.4)",
          animation: `float-up ${p.dur}s linear ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  );
};

interface ChatMessage { from: "me" | "them"; text: string; time: string; react?: string; }
interface CallEntry { type: "in" | "out" | "missed"; dur: string; day: string; }

interface Card {
  tag: string;
  caption: string;
  sub: string;
  shimmer: string;
  circle: string;
  type: "photo" | "chat" | "calls";
  photo?: string;
  bg?: string;
  messages?: ChatMessage[];
  calls?: CallEntry[];
}

const CARDS: Card[] = [
  {
    tag: "vibes",
    caption: "The one who just gets it",
    sub: "always on the same wavelength",
    shimmer: "#f9a8d4",
    circle: "#ec4899",
    type: "photo",
    photo: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&q=80",
  },
  {
    tag: "vibes2",
    caption: "The one who just gets it",
    sub: "always on the same wavelength",
    shimmer: "#f9a8d4",
    circle: "#ec4899",
    type: "photo",
    photo: "/insta.jpeg",
  },
  {
    tag: "calls",
    caption: "Always picks up",
    sub: "no matter what time it is",
    shimmer: "#67e8f9",
    circle: "#06b6d4",
    type: "calls",
    bg: "linear-gradient(160deg,hsl(220 55% 10%) 0%,hsl(240 50% 8%) 100%)",
    calls: [
      { type: "out",    dur: "1h 12m", day: "Today"     },
      { type: "out",    dur: "34m",    day: "Yesterday"  },
      { type: "missed", dur: "—",      day: "Mon"        },
      { type: "in",     dur: "2h 03m", day: "Sun"        },
    ],
  },
  {
    tag: "energy",
    caption: "Chaotic good, always",
    sub: "the kind of friend you need",
    shimmer: "#fde68a",
    circle: "#f59e0b",
    type: "photo",
    photo: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
  },
];

const PEEK = [
  { x: 0,  y: 0,  scale: 1,    rotate: 0,   opacity: 1,    z: 10 },
  { x: 12, y: 16, scale: 0.92, rotate: 2.5, opacity: 0.5,  z: 5  },
  { x: 22, y: 28, scale: 0.85, rotate: 5,   opacity: 0.25, z: 2  },
  { x: 30, y: 38, scale: 0.79, rotate: 7,   opacity: 0,    z: 1  },
];

const PhotoFace = ({ card, isTop }: { card: Card; isTop: boolean }) => (
  <>
    <div style={{ position: "absolute", inset: 0 }}>
      <img src={card.photo} alt={card.caption} draggable={false}
        style={{ width: "100%", height: "100%", objectFit: "cover",
          animation: isTop ? "bob-slow 6s ease-in-out infinite alternate" : "none" }} />
    </div>
    <div style={{ position: "absolute", inset: 0,
      background: "linear-gradient(to bottom,rgba(0,0,0,0.5) 0%,rgba(0,0,0,0) 35%,rgba(0,0,0,0) 55%,rgba(0,0,0,0.72) 100%)" }} />
  </>
);

const ChatFace = ({ card }: { card: Card }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: card.bg }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
      borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%",
        background: "linear-gradient(135deg,#fb7185,#a855f7)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, border: "1px solid rgba(255,255,255,0.2)", flexShrink: 0 }}>🌸</div>
      <div>
        <p style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.9)", margin: 0 }}>Deva 🐼</p>
        <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
          Active now
        </p>
      </div>
      <span style={{ marginLeft: "auto", fontSize: 13, color: "rgba(255,255,255,0.35)" }}>📞</span>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "8px 12px", flex: 1, overflow: "hidden" }}>
      <p style={{ textAlign: "center", fontSize: 8, color: "rgba(255,255,255,0.2)", margin: "0 0 4px" }}>Today 11:42 AM</p>
      {card.messages?.map((msg, mi) => (
        <div key={mi} style={{ display: "flex", flexDirection: "column", alignItems: msg.from === "me" ? "flex-end" : "flex-start" }}>
          <div style={{
            padding: "6px 10px", borderRadius: 16, fontSize: 10, lineHeight: 1.4, maxWidth: "80%", color: "#fff",
            background: msg.from === "me" ? "linear-gradient(135deg,#f472b6,#c084fc)" : "rgba(255,255,255,0.1)",
            borderBottomRightRadius: msg.from === "me" ? 4 : 16,
            borderBottomLeftRadius: msg.from === "them" ? 4 : 16,
          }}>{msg.text}</div>
          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>
            {msg.time} {msg.react ?? ""}
          </span>
        </div>
      ))}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
      background: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: 999,
        padding: "4px 12px", fontSize: 9, color: "rgba(255,255,255,0.25)" }}>Message...</div>
      <span style={{ fontSize: 14 }}>❤️</span>
    </div>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
      background: "linear-gradient(to bottom,transparent 55%,rgba(31,5,32,0.92) 100%)" }} />
  </div>
);

const CallsFace = ({ card }: { card: Card }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: card.bg }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px",
      borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <span style={{ fontSize: 16 }}>📞</span>
      <p style={{ flex: 1, fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.85)", margin: 0 }}>Recents</p>
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>⋯</span>
    </div>
    <div style={{ display: "flex", flexDirection: "column" }}>
      {card.calls?.map((call, ci) => (
        <div key={ci}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg,#60a5fa,#2563eb)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>🌸</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.9)", margin: 0 }}>Deva 🐼</p>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", margin: "2px 0 0", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: call.type === "in" ? "#22c55e" : call.type === "out" ? "#60a5fa" : "#f87171" }}>
                  {call.type === "in" ? "↙" : call.type === "out" ? "↗" : "↙"}
                </span>
                <span style={{ color: call.type === "missed" ? "#f87171" : undefined }}>
                  {call.type === "in" ? "Incoming" : call.type === "out" ? "Outgoing" : "Missed"}
                </span>
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", margin: 0 }}>{call.dur}</p>
              <p style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", margin: 0 }}>{call.day}</p>
            </div>
          </div>
          {ci < (card.calls?.length ?? 0) - 1 && (
            <div style={{ margin: "0 14px", height: 1, background: "rgba(255,255,255,0.05)" }} />
          )}
        </div>
      ))}
    </div>
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
      background: "linear-gradient(to bottom,transparent 45%,rgba(4,14,42,0.92) 100%)" }} />
  </div>
);

interface Props { onNext: () => void; onBack: () => void; }

export const MemoriesSection = ({ onNext, onBack }: Props) => {
  const [cur, setCur] = useState(0);
  const startX = useRef(0);
  const startY = useRef(0);

  const goTo = (n: number) => setCur(Math.max(0, Math.min(CARDS.length - 1, n)));

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
  const item = {
    hidden: { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section style={{
      position: "relative", display: "flex", minHeight: "100%", width: "100%",
      flexDirection: "column", alignItems: "center", justifyContent: "space-between",
      overflow: "hidden",
      background: "radial-gradient(ellipse 80% 70% at 50% 0%,hsl(295 60% 14%) 0%,hsl(330 50% 10%) 50%,hsl(340 55% 8%) 100%)",
      padding: "40px 20px", fontFamily: "'Jost', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Jost:wght@300;400&display=swap');
        @keyframes bob-slow { from { transform: scale(1.0); } to { transform: scale(1.06); } }
        @keyframes shimmer-slide { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
        @keyframes float-up {
          0%   { transform: translateY(0); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>

      <FloatingParticles count={24} />

      <motion.div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}
        variants={container} initial="hidden" animate="show">

        <motion.p variants={item} style={{ marginBottom: 4, fontSize: 11, textTransform: "uppercase",
          letterSpacing: "0.14em", color: "hsl(340 80% 65% / 0.55)" }}>✦ A little collection</motion.p>
        <motion.h2 variants={item} style={{ marginBottom: 4, fontFamily: "'Playfair Display',serif",
          fontSize: 28, fontWeight: 400, color: "hsl(330 70% 92%)", textAlign: "center",
          textShadow: "0 0 30px hsl(330 80% 65%/0.3)" }}>A few little things…</motion.h2>
        <motion.p variants={item} style={{ marginBottom: 24, fontSize: 12,
          color: "hsl(330 40% 70% / 0.55)", textAlign: "center" }}>
          The kind of things that make you, you.
        </motion.p>

        {/* Card stack */}
        <motion.div variants={item} style={{ position: "relative", width: "100%", height: 380, marginBottom: 16 }}>
          {CARDS.map((card, i) => {
            const off = i - cur;
            const gone = off < 0;
            const peek = PEEK[Math.min(Math.max(off, 0), PEEK.length - 1)];
            const isTop = off === 0;

            return (
              <motion.div
                key={card.tag}
                animate={{
                  x: gone ? "-115%" : peek.x,
                  y: gone ? 0 : peek.y,
                  scale: gone ? 0.9 : peek.scale,
                  rotate: gone ? -10 : peek.rotate,
                  opacity: gone ? 0 : peek.opacity,
                  zIndex: gone ? 0 : peek.z,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                style={{
                  position: "absolute", inset: 0, borderRadius: 30, overflow: "hidden",
                  userSelect: "none", touchAction: "none",
                  boxShadow: isTop
                    ? "0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)"
                    : "0 12px 40px rgba(0,0,0,0.3)",
                  pointerEvents: isTop ? "auto" : "none",
                  cursor: isTop ? "grab" : "default",
                }}
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  startX.current = e.clientX;
                  startY.current = e.clientY;
                }}
                onPointerUp={(e) => {
                  const dx = e.clientX - startX.current;
                  const dy = Math.abs(e.clientY - startY.current);
                  if (Math.abs(dx) > 45 && Math.abs(dx) > dy) goTo(dx < 0 ? cur + 1 : cur - 1);
                }}
              >
                {card.type === "photo" && <PhotoFace card={card} isTop={isTop} />}
                {card.type === "chat"  && <ChatFace  card={card} />}
                {card.type === "calls" && <CallsFace card={card} />}

                {/* Shared overlays */}
                <div style={{ position: "absolute", inset: 0, mixBlendMode: "soft-light", opacity: 0.4,
                  background: `radial-gradient(ellipse at 70% 20%, ${card.circle} 0%, transparent 70%)` }} />
                <div style={{ position: "absolute", inset: 0, pointerEvents: "none",
                  background: "linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 50%)" }} />
                {isTop && (
                  <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: "inherit", pointerEvents: "none" }}>
                    <div style={{ position: "absolute", inset: 0,
                      background: "linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.08) 50%,transparent 60%)",
                      animation: "shimmer-slide 2.4s ease 0.5s 1" }} />
                  </div>
                )}

                {/* Content overlay */}
                <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column",
                  justifyContent: "space-between", height: "100%", padding: 24 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <span style={{ borderRadius: 999, border: "1px solid rgba(255,255,255,0.25)",
                      background: "rgba(0,0,0,0.3)", padding: "4px 12px", fontSize: 10,
                      textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.7)",
                      backdropFilter: "blur(8px)" }}>{card.tag}</span>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: 42, fontWeight: 700,
                      lineHeight: 1, color: "rgba(255,255,255,0.15)", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div>
                    <div style={{ marginBottom: 12, height: 2, width: 40, borderRadius: 999,
                      background: `linear-gradient(90deg,${card.shimmer},transparent)` }} />
                    <p style={{ fontFamily: "'Playfair Display',serif", fontStyle: "italic",
                      fontSize: 24, color: "#fff", lineHeight: 1.3, marginBottom: 6,
                      textShadow: "0 2px 20px rgba(0,0,0,0.6)" }}>{card.caption}</p>
                    <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em",
                      color: "rgba(255,255,255,0.5)" }}>{card.sub}</p>
                    {isTop && (
                      <p style={{ marginTop: 12, fontSize: 10, textTransform: "uppercase",
                        letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)",
                        display: "flex", alignItems: "center", gap: 4 }}>
                        <span>←</span> swipe <span>→</span>
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, pointerEvents: "none",
                  background: `linear-gradient(90deg,transparent,${card.shimmer},transparent)`, opacity: 0.7 }} />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Nav row */}
        <motion.div variants={item} style={{ display: "flex", width: "100%", alignItems: "center",
          justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {CARDS.map((_, i) => (
              <button key={i} onClick={() => goTo(i)} aria-label={`Card ${i + 1}`}
                style={{ height: 4, borderRadius: 999, border: "none", cursor: "pointer",
                  transition: "all 0.3s", padding: 0,
                  width: i === cur ? 20 : 4,
                  background: i === cur ? "hsl(330 80% 68%)" : "hsl(330 80% 68% / 0.22)" }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[{ label: "←", delta: -1 }, { label: "→", delta: 1 }].map(({ label, delta }) => (
              <button key={label} onClick={() => goTo(cur + delta)}
                disabled={delta === -1 ? cur === 0 : cur === CARDS.length - 1}
                style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.55)", fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  transition: "all 0.2s",
                  opacity: (delta === -1 ? cur === 0 : cur === CARDS.length - 1) ? 0.2 : 1,
                }}>{label}</button>
            ))}
          </div>
        </motion.div>

        {/* Buttons */}
        <motion.div variants={item} style={{ display: "flex", width: "100%", gap: 10 }}>
          <GlowButton variant="ghost" onClick={onBack}>← Back</GlowButton>
          <GlowButton onClick={onNext}>Continue →</GlowButton>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default function Preview() {
  return <div style={{ width: "100%", height: "100vh" }}><MemoriesSection onNext={() => {}} onBack={() => {}} /></div>;
}