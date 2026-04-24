## 🎂 Romantic Birthday Experience for Deva Darshini

A single-page React app with 6 full-screen, button-navigated sections. Each section fades and slides in with Framer Motion. Theme: deep night gradient (midnight violet → rose), pastel pink & violet accents, soft glowing highlights, floating particles.

---

### Global feel & shell
- **Palette**: deep violet `#1a0b2e` → rose-black `#2d1133` background gradients, pastel pink `#ffd1e8`, soft violet `#c8b6ff`, glow rose `#ff8fc7`, warm candle gold `#ffd27a`.
- **Typography**: elegant serif for headings (Cormorant Garamond / Playfair), clean sans for body (Inter).
- **Layout**: full-viewport sections (`h-screen`), centered content, fully responsive (mobile-first), smooth.
- **Navigation**: Next / Back buttons in each section + tiny 6-dot progress indicator at the bottom. No scroll navigation.
- **Transitions**: AnimatePresence between sections — combined fade + slide (incoming from right, outgoing to left), ~600ms ease.
- **Reusable bits**: `Typewriter` component (sequential lines with caret + fade), `FloatingParticles` (canvas/SVG glowing dots), `GlowButton` (hover scale + soft glow ring).

---

### Page 1 — Intro 💫
- Dark gradient backdrop with ~40 floating, slowly drifting glowing particles.
- Centered typewriter sequence (each line types, holds, then next line fades in beneath):
  1. "Hey Deva Darshini ❤️"
  2. "25th April… a beautiful day"
  3. "Because someone special was born today ✨"
- After all lines render, a glowing **"Start"** button fades in (hover scale + pulsing glow).

### Page 2 — Birthday Wish 🎉
- Centered glass-morphism card with soft rose/violet glow that gently breathes (scale 1 ↔ 1.02 loop).
- Inside the card:
  - "Happy Birthday, Deva Darshini 🎂" (large serif)
  - "Wishing you happiness, smiles, and everything you dream of"
- Tiny floating sparkles around the card.
- Small **🔊 sound toggle** in the top-right corner (persists across all pages — controls celebration/cake sound effects only; no background music).
- Next button.

### Page 3 — Vibe / Memories 🌸
- Heading: "A few little things…"
- 4 animated cards in a responsive grid (1 col mobile → 2 col tablet → 4 col desktop).
- Each card is a pretty pastel gradient placeholder (pink↔violet, peach↔rose, lavender↔blush, etc.) with a soft inner glow.
- Captions, one per card:
  - "Little moments"
  - "Random smiles"
  - "Simple memories"
  - "But all special in their own way"
- Stagger fade-in on mount; on hover: scale up slightly + intensify glow.
- Next button.

### Page 4 — Message 💌
- Quiet, intimate composition — minimal background, soft floating petals.
- Typewriter sequence, line by line with fade:
  1. "I may just be your friend…"
  2. "But I really value you more than you know"
  3. "You bring a kind of calm and happiness that's rare"
  4. "And today, I just wanted to make you feel a little special"
- Next button appears after final line.

### Page 5 — Cake Interaction 🎂
- Stylized SVG/CSS birthday cake (tiered, pink frosting, sprinkles) sitting center-stage.
- Single candle on top with an animated **flickering flame** (subtle scale + hue shift loop, soft amber glow halo behind it).
- Text above the cake:
  - "Make a wish, Deva Darshini…"
  - "And blow the candle 🕯️"
- Two ways to blow it out:
  1. **🎤 Blow into the mic** — on entering this page, ask for mic permission. Use Web Audio API to monitor input volume; when it spikes above a threshold for a brief moment, the candle blows out.
  2. **"Blow Candle" button** — always available as fallback (and used if mic permission denied).
- On extinguish:
  - Flame fades and a small wisp of smoke curls up.
  - Confetti burst across the screen (canvas-confetti).
  - Celebration sound effect plays (respecting the sound toggle).
  - Text fades in: "May all your wishes come true ❤️"
  - Next button appears.

### Page 6 — Final Message 🌙
- Calm, dreamy backdrop — soft starry violet gradient.
- Centered glowing **heart** (SVG) that pulses gently with a rose halo.
- Typewriter + fade sequence:
  1. "No matter what I am to you…"
  2. "I'll always wish you happiness"
  3. "Keep smiling, Deva Darshini ✨"
  4. "Once again, Happy Birthday ❤️"
- **"Replay"** button — resets state and returns to Page 1 with the opening transition.

---

### Animations summary
- Section transitions: fade + horizontal slide (Framer Motion `AnimatePresence`).
- Text: typewriter character-by-character with blinking caret, then fade-in for the next line.
- Buttons: hover scale 1.05 + glow ring intensify.
- Candle flame: continuous flicker (scale, opacity, slight rotate) with amber drop-shadow.
- Heart: soft scale pulse + halo opacity loop.
- Cards: stagger-in on mount, hover scale + glow.
- Particles: independent slow drift loops.

### Tech & dependencies
- React + Tailwind (already set up).
- Add: `framer-motion` (transitions/animations), `canvas-confetti` (confetti burst).
- Web Audio API (built-in) for mic blow detection.
- Sound effects: short royalty-free celebration chime hosted in `/public` (respects mute toggle; off by default until first user interaction so autoplay policies don't break it).
- Fully responsive — all sections tested at mobile / tablet / desktop breakpoints.
